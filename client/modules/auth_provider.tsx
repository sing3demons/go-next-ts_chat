import { useRouter } from 'next/router'
import React, { createContext, useEffect, useState } from 'react'

export interface UserInfo {
  username: string
  id: string
}

interface authContext {
  authenticated: boolean
  setAuthenticated: (auth: boolean) => void
  user: UserInfo
  setUser: (user: UserInfo) => void
}

export const AuthContext = createContext<authContext>({
  authenticated: false,
  setAuthenticated: (auth: boolean) => {},
  user: { username: '', id: '' },
  setUser: () => {},
})

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<UserInfo>({ username: '', id: '' })
  const router = useRouter()

  useEffect(() => {
    const userInfo = localStorage.getItem('user_info')
    if (!userInfo) {
      if (window.location.pathname != '/signup') {
        router.push('/login')
        return
      }
    } else {
      const user: UserInfo = JSON.parse(userInfo)
      if (user) {
        setUser({
          username: user.username,
          id: user.id,
        })
      }
      setAuthenticated(true)
    }
  }, [authenticated])

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        setUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
