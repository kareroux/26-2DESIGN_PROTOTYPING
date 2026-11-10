import type { Status } from '../lib/device'

type Props = {
  status: Status
  onConnect: () => Promise<void>
  onDisconnect: () => Promise<void>
}

const statusContent: Record<Status, { label: string; className: string }> = {
  disconnected: { label: '연결 안 됨', className: 'is-disconnected' },
  connecting: { label: '연결 중…', className: 'is-connecting' },
  connected: { label: '연결됨', className: 'is-connected' },
  error: { label: '연결 실패, 다시 시도', className: 'is-error' },
}

export default function ConnectionControl({ status, onConnect, onDisconnect }: Props) {
  const connected = status === 'connected'
  const connecting = status === 'connecting'
  const content = statusContent[status]

  return (
    <div className="control-row">
      <div>
        <p className="t-label control-name">센서</p>
        <div className={`t-label connection-status ${content.className}`} role="status">
          <span className="status-dot" aria-hidden="true" />
          <span>{content.label}</span>
        </div>
      </div>
      <button
        className={`t-label action-button ${connected ? 'secondary' : 'primary'}`}
        type="button"
        disabled={connecting}
        onClick={() => void (connected ? onDisconnect() : onConnect())}
      >
        {connected ? '연결 끊기' : '센서 연결'}
      </button>
    </div>
  )
}
