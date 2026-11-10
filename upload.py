"""Arduino (sensor_unity.ino) -> serial -> Supabase readings.value

Reads the "level,raw" lines the sketch prints at 9600 and stores the
level (0.00-1.00) in the value column.
"""

import glob
import sys
import time

import serial
from supabase import create_client

SUPABASE_URL = "https://wrnwmxpyxhyksyzggtpn.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_lUc9MEmmeo6dvzX7BmJiKQ_h8yReFRr"

PORT = ""           # leave empty to auto-detect the Arduino
BAUD = 9600
MIN_GAP = 0.25      # seconds between uploads; the sketch sends 20x faster


def find_port():
    if PORT:
        return PORT
    candidates = glob.glob("/dev/cu.usbmodem*") + glob.glob("/dev/cu.usbserial*")
    if not candidates:
        sys.exit("No Arduino port found. Plug the board in, or set PORT at the top of this file.")
    return candidates[0]


def main():
    db = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    port = find_port()
    ser = serial.Serial(port, BAUD, timeout=2)
    print(f"listening on {port}")
    time.sleep(2)          # the Uno resets when the port opens
    ser.reset_input_buffer()

    last_sent = 0.0

    while True:
        line = ser.readline().decode("utf-8", errors="ignore").strip()
        if not line or line.startswith("#"):
            continue

        try:
            level = float(line.split(",")[0])
        except (ValueError, IndexError):
            print(f"skipped: {line!r}")
            continue

        now = time.monotonic()
        if now - last_sent < MIN_GAP:
            continue
        last_sent = now

        db.table("readings").insert({"value": round(level, 3)}).execute()
        print(f"{level:.2f}  {'PRESSED' if level > 0.5 else ''}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nstopped")
