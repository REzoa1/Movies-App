import { ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'

import './scss/index.scss'
import App from './components/App/App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <ConfigProvider
    theme={{
      token: {
        fontFamily:
          '-apple-system, "DM Sans", "Inter", BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      },
      components: {
        Pagination: {
          itemSize: 22,
        },
      },
    }}
  >
    <App />
  </ConfigProvider>
)
