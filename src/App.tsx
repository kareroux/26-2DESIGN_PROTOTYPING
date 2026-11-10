import { useCallback, useEffect, useState } from 'react'
import ConnectionControl from './components/ConnectionControl'
import PowerToggle from './components/PowerToggle'
import ProductHeader from './components/ProductHeader'
import SensorChart from './components/SensorChart'
import SensorMoon from './components/SensorMoon'
import {
  connectSensor,
  disconnectSensor,
  loadPower,
  setLedPower,
  type Reading,
  type Status,
} from './lib/device'
import { MAX_POINTS } from './product'

function App() {
  const [status, setStatus] = useState<Status>('disconnected')
  const [power, setPower] = useState(false)
  const [readings, setReadings] = useState<Reading[]>([])

  const handleReading = useCallback((row: Reading) => {
    setReadings((current) => [...current, row].slice(-MAX_POINTS))
  }, [])

  const handleConnect = useCallback(async () => {
    await connectSensor({
      onInit: setReadings,
      onReading: handleReading,
      onStatus: setStatus,
    })
  }, [handleReading])

  const handleDisconnect = useCallback(async () => {
    await disconnectSensor()
    setStatus('disconnected')
  }, [])

  const handlePowerChange = useCallback(
    async (nextPower: boolean) => {
      const previousPower = power
      setPower(nextPower)
      const didUpdate = await setLedPower(nextPower)

      if (!didUpdate) {
        setPower(previousPower)
      }

      return didUpdate
    },
    [power],
  )

  useEffect(() => {
    void loadPower().then(setPower)
    void handleConnect()

    return () => {
      void disconnectSensor()
    }
  }, [handleConnect])

  const latestValue = readings.at(-1)?.value

  return (
    <main className="app-shell">
      <ProductHeader />
      <SensorMoon value={latestValue} power={power} />

      <div className="dashboard-grid">
        <section className="controls" aria-label="조명 제어">
          <ConnectionControl
            status={status}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
          <PowerToggle power={power} onChange={handlePowerChange} />
        </section>

        <SensorChart readings={readings} />
      </div>
    </main>
  )
}

export default App
