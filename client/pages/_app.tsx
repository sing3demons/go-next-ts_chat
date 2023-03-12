import AuthProvider from '@/modules/auth_provider'
import WebsocketProvider from '@/modules/websocket_provider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <WebsocketProvider>
        <div className="flex flex-col md:flex-row h-full min-h-screen font-sans">
          <Component {...pageProps} />
        </div>
      </WebsocketProvider>
    </AuthProvider>
  )
}
