import React, { ReactNode, createContext, useState } from 'react'
type Conn = WebSocket | null

interface WebsocketContext {
  conn: Conn
  setConn: (c: Conn) => void
}
export const WebsocketContext = createContext<WebsocketContext>({
  conn: null,
  setConn: () => {},
})

export default function WebsocketProvider({
  children,
}: {
  children: ReactNode
}) {
  const [conn, setConn] = useState<Conn>(null)
  return (
    <WebsocketContext.Provider
      value={{
        conn: conn,
        setConn: setConn,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  )
}
