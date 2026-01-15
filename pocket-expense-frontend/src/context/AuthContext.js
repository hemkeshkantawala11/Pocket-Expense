import { createContext, useEffect, useState } from "react"
import { getToken, saveToken, removeToken } from "../utils/storage"

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken()
      setUserToken(token)
      setLoading(false)
    }
    loadToken()
  }, [])

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken()

      if (token) {
        setUserToken(token)
      } else {
        setUserToken(null)
      }

      setLoading(false)
    }

    loadToken()
  }, [])



  const login = async (token) => {
    await saveToken(token)
    setUserToken(token)
  }

  const logout = async () => {
    await removeToken()
    setUserToken(null)
  }

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
