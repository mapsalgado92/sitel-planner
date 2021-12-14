import Link from "next/link"

import { useState } from "react"

import { useAuth } from "../contexts/authContext"

const Header = () => {
  const [isActive, setisActive] = useState(false)
  const auth = useAuth()

  return (
    <nav
      className="navbar container"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item is-size-5" href="/">
            Sitel Planner
          </a>
        </Link>

        <a
          role="button"
          onClick={() => setisActive(!isActive)}
          className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        className={`navbar-menu ${isActive ? "is-active" : ""}`}
      >
        <div className="navbar-end">
          <Link href="/">
            <a className="navbar-item ml-3 is-size-5">Home</a>
          </Link>

          <Link href="/events">
            <a className="navbar-item ml-3 is-size-5">Events</a>
          </Link>
          {auth.user && auth.logged && (
            <Link href={"/admin?user=" + auth.user.id}>
              <a className="navbar-item ml-3 is-danger is-size-5">
                Admin
                <span className="is-size-6 ml-2 has-text-link">
                  {auth.user.name}
                </span>
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header
