import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

// 引入 i18n 配置（必须在 App 之前导入）
import './i18n'

import './index.css'
import App from './App.jsx'

// 加载状态组件
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#666'
  }}>
    Loading...
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  </StrictMode>,
)