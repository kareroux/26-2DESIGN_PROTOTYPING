import { useState } from 'react'

type Props = {
  power: boolean
  onChange: (power: boolean) => Promise<boolean>
}

export default function PowerToggle({ power, onChange }: Props) {
  const [hasError, setHasError] = useState(false)

  const toggle = async () => {
    setHasError(false)
    const didUpdate = await onChange(!power)
    setHasError(!didUpdate)
  }

  return (
    <div>
      <div className="control-row">
        <div>
          <p className="t-label control-name">LED 전원</p>
          <p className="t-caption power-state">{power ? '켜짐' : '꺼짐'}</p>
        </div>
        <button
          className="power-toggle"
          type="button"
          role="switch"
          aria-checked={power}
          aria-label="LED 전원"
          data-power={power ? 'on' : 'off'}
          onClick={() => void toggle()}
        >
          <span aria-hidden="true" />
        </button>
      </div>
      {hasError && (
        <p className="t-caption power-error" role="alert">
          전원 변경 실패, 다시 시도
        </p>
      )}
    </div>
  )
}
