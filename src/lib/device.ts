import type { RealtimeChannel } from '@supabase/supabase-js'
import { DEVICE_ID, MAX_POINTS, SENSOR_MAX, SENSOR_MIN } from '../product'
import { db, IS_DEMO_MODE } from './supabase'

export type Reading = { value: number; created_at: string }
export type Status = 'disconnected' | 'connecting' | 'connected' | 'error'

type ConnectOptions = {
  onInit: (rows: Reading[]) => void
  onReading: (row: Reading) => void
  onStatus: (status: Status) => void
}

let channel: RealtimeChannel | null = null
let demoTimer: ReturnType<typeof setInterval> | null = null
let demoPower = true
let demoStep = 0

function demoValue(step: number) {
  const midpoint = (SENSOR_MAX + SENSOR_MIN) / 2
  const amplitude = (SENSOR_MAX - SENSOR_MIN) * 0.38
  return Math.round(midpoint + Math.sin(step / 8) * amplitude)
}

function stopDemo() {
  if (demoTimer) {
    clearInterval(demoTimer)
    demoTimer = null
  }
}

async function connectDemo({ onInit, onReading, onStatus }: ConnectOptions) {
  stopDemo()
  onStatus('connecting')

  const now = Date.now()
  const initialRows = Array.from({ length: 24 }, (_, index) => {
    const step = demoStep + index
    return {
      value: demoValue(step),
      created_at: new Date(now - (23 - index) * 500).toISOString(),
    }
  })

  demoStep += initialRows.length
  onInit(initialRows)
  onStatus('connected')

  demoTimer = setInterval(() => {
    onReading({
      value: demoValue(demoStep),
      created_at: new Date().toISOString(),
    })
    demoStep += 1
  }, 500)
}

export async function connectSensor(options: ConnectOptions): Promise<void> {
  if (IS_DEMO_MODE || !db) {
    await connectDemo(options)
    return
  }

  await disconnectSensor()
  options.onStatus('connecting')

  const { data, error } = await db
    .from('sensor_readings')
    .select('value, created_at')
    .eq('device_id', DEVICE_ID)
    .order('created_at', { ascending: false })
    .limit(MAX_POINTS)

  if (error) {
    options.onStatus('error')
    return
  }

  options.onInit(((data ?? []) as Reading[]).reverse())
  channel = db
    .channel(`sensor_readings:${DEVICE_ID}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'sensor_readings',
        filter: `device_id=eq.${DEVICE_ID}`,
      },
      (payload) => options.onReading(payload.new as Reading),
    )
    .subscribe((state) => {
      if (state === 'SUBSCRIBED') options.onStatus('connected')
      if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT') {
        options.onStatus('error')
      }
    })
}

export async function disconnectSensor(): Promise<void> {
  stopDemo()

  if (channel && db) {
    await db.removeChannel(channel)
    channel = null
  }
}

export async function setLedPower(on: boolean): Promise<boolean> {
  if (IS_DEMO_MODE || !db) {
    demoPower = on
    return true
  }

  const { error } = await db
    .from('device_state')
    .update({ led_on: on, updated_at: new Date().toISOString() })
    .eq('device_id', DEVICE_ID)

  return !error
}

export async function loadPower(): Promise<boolean> {
  if (IS_DEMO_MODE || !db) return demoPower

  const { data, error } = await db
    .from('device_state')
    .select('led_on')
    .eq('device_id', DEVICE_ID)
    .maybeSingle()

  return error ? false : Boolean(data?.led_on)
}
