import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import Cookies from "js-cookie"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useState(false)
  const [user, setUser] = useState({})

  useEffect(() => {
    let cookie = Cookies.get("user")
    console.log(cookie)
    if (cookie) {
      console.log("did it do this?")
      setUser(JSON.parse(cookie))
      setLogged(true)
    }
  }, [])

  const router = useRouter()

  const login = async ({ event, password }) => {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password, event: event }),
    }

    console.log(request)

    fetch("/api/admin/login", request)
      .then((response) => response.json())
      .then((data) => {
        setLogged(data.logged)
        setUser({ id: event })
        Cookies.set("user", JSON.stringify({ id: event }), { expires: 1 })
        alert(data.message)
      })
      .catch((err) => {})
  }

  const logout = () => {
    setUser(null)
    setLogged(false)
    Cookies.remove("user")
  }

  return (
    <AuthContext.Provider value={{ logged, user, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
