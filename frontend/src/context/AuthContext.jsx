import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      api.get('/wallet')
        .then(() => {
          // Token is valid, get user profile if needed or mock user from localStorage
          const savedUser = localStorage.getItem('user_name')
          if (savedUser) {
            setUser({ name: savedUser })
          }
        })
        .catch(() => {
          logout()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    // First get CSRF cookie for Sanctum SPA if needed, but since we use Bearer token from token-based login:
    // Let's create a login endpoint or use token
    const response = await api.post('/login', { email, password })
    const { token, user } = response.data
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_name', user.name)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_name')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
