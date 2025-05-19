import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface AuthContextType {
  user: { name: string; ID: string } | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; ID: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('name')
    const ID = localStorage.getItem('ID')
    

    if (token && name && ID) {
      setUser({ name, ID})
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const response = await api.post('/user/login', { email, password })
    const { token, name, ID,person,photo } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('name', name)
    localStorage.setItem('ID', ID)
    localStorage.setItem('person', person)
    localStorage.setItem('photo', photo)

    setUser({ name, ID })
    navigate('/dashboard')
  }

  const signOut = () => {
    localStorage.clear()
    setUser(null)
    navigate('/signin')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
