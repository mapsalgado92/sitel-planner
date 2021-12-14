import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import { route } from "next/dist/server/router"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useState(false)
  const [user, setUser] = useState({})
  const router = useRouter()

  useEffect(() => {
    let cookie = Cookies.get("user")

    if (cookie) {
      console.log("did it do this?")
      setUser(JSON.parse(cookie))
      setLogged(true)
      console.log("LOGGED IN FROM COOKIE")
    } else {
      console.log("NO COOKIE")
    }
  }, [])

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
        console.log("DATA USER", data.user)
        setUser(data.user)
        Cookies.set("user", JSON.stringify(data.user), { expires: 1 })
        alert(data.message)
        if (data.logged) {
          router.push(`/admin?user=${data.user.id}`)
        }
      })
      .catch((err) => alert("Something went wrong!"))
  }

  const logout = () => {
    setUser(null)
    setLogged(false)
    Cookies.remove("user")
  }

  return (
    <AuthContext.Provider value={{ logged, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
