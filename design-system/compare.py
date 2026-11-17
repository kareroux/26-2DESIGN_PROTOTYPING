#!/usr/bin/env python3
"""Percentage pixel difference between two sets of renders.

Reports the whole frame and, separately, the HUD bands (top 12% and bottom 25%)
versus the 3D scene in between -- so a HUD restyle that leaves the geometry
alone is visible as such instead of as one meaningless global number.
"""
import sys, os, zlib, struct

def read_png(p):
    d = open(p, 'rb').read()
    assert d[:8] == b'\x89PNG\r\n\x1a\n'
    i, idat, w = 8, b'', None
    while i < len(d):
        ln = struct.unpack('>I', d[i:i+4])[0]; typ = d[i+4:i+8]; body = d[i+8:i+8+ln]
        if typ == b'IHDR':
            w, h, depth, ctype = struct.unpack('>IIBB', body[:10])
            assert depth == 8 and ctype in (2, 6), (depth, ctype)
            ch = 3 if ctype == 2 else 4
        elif typ == b'IDAT': idat += body
        elif typ == b'IEND': break
        i += 12 + ln
    raw = zlib.decompress(idat)
    stride = w * ch
    out = bytearray(w * h * ch); prev = bytearray(stride); pos = 0
    for y in range(h):
        f = raw[pos]; pos += 1
        line = bytearray(raw[pos:pos+stride]); pos += stride
        if f == 1:
            for x in range(ch, stride): line[x] = (line[x] + line[x-ch]) & 255
        elif f == 2:
            for x in range(stride): line[x] = (line[x] + prev[x]) & 255
        elif f == 3:
            for x in range(stride):
                a = line[x-ch] if x >= ch else 0
                line[x] = (line[x] + ((a + prev[x]) >> 1)) & 255
        elif f == 4:
            for x in range(stride):
                a = line[x-ch] if x >= ch else 0
                c = prev[x-ch] if x >= ch else 0
                b = prev[x]
                pp = a + b - c
                pa, pb, pc = abs(pp-a), abs(pp-b), abs(pp-c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 255
        out[y*stride:(y+1)*stride] = line; prev = line
    return w, h, ch, bytes(out)

def diff(a, b, thresh=8):
    wa, ha, ca, da = a; wb, hb, cb, db = b
    if (wa, ha) != (wb, hb): return None
    bands = {'frame': (0, ha), 'hud-top': (0, int(ha*0.12)),
             'scene': (int(ha*0.12), int(ha*0.75)), 'hud-bottom': (int(ha*0.75), ha)}
    res = {}
    for name, (y0, y1) in bands.items():
        n = chg = 0
        for y in range(y0, y1):
            ro = y*wa*ca
            for x in range(0, wa*ca, ca):
                o = ro+x
                if (abs(da[o]-db[o]) > thresh or abs(da[o+1]-db[o+1]) > thresh
                        or abs(da[o+2]-db[o+2]) > thresh): chg += 1
                n += 1
        res[name] = 100.0*chg/n if n else 0.0
    return res

A, B = sys.argv[1], sys.argv[2]
worst = 0.0
for f in sorted(os.listdir(A)):
    if not f.endswith('.png'): continue
    r = diff(read_png(os.path.join(A, f)), read_png(os.path.join(B, f)))
    if r is None: print(f'{f}: SIZE MISMATCH'); continue
    worst = max(worst, r['scene'])
    print(f"{f}  frame {r['frame']:6.2f}%   hud-top {r['hud-top']:6.2f}%   "
          f"scene {r['scene']:6.2f}%   hud-bottom {r['hud-bottom']:6.2f}%")
print(f"\nworst scene drift: {worst:.2f}%")
