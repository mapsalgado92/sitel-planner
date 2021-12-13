import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useState(false)
  const [token, setToken] = useState(null)

  const login = ({ event, password }) => {
    let request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, event }),
    }
    fetch("/api/admin/login", request)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch()
  }

  const logout = () => {
    setToken(null)
    setLogged(false)
  }

  return (
    <AuthContext.Provider value={(logged, token, login, logout)}>
      {children}
    </AuthContext.Provider>
  )
}

export function useCount() {
  return useContext(AuthContext)
}
