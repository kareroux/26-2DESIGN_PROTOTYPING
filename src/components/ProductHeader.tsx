import { useEffect } from 'react'
import { IS_DEMO_MODE } from '../lib/supabase'
import { PRODUCT } from '../product'

const placeholders = {
  name: '[제품 이름]',
  concept: '[제품 컨셉, 한 줄]',
  description: '[제품 설명, 2~3문장]',
}

export default function ProductHeader() {
  const name = PRODUCT.name || placeholders.name
  const concept = PRODUCT.concept || placeholders.concept
  const description = PRODUCT.description || placeholders.description

  useEffect(() => {
    document.title = PRODUCT.name || placeholders.name
  }, [])

  return (
    <header className="product-header">
      <h1 className={`t-display ${PRODUCT.name ? '' : 'placeholder'}`}>{name}</h1>
      <p className={`t-label product-concept ${PRODUCT.concept ? '' : 'placeholder'}`}>
        {concept}
      </p>
      <p className={`t-body product-description ${PRODUCT.description ? '' : 'placeholder'}`}>
        {description}
      </p>
      {IS_DEMO_MODE && <p className="t-caption demo-note">데모 데이터로 표시 중</p>}
    </header>
  )
}
