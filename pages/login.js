import Head from "next/head"
import { useState } from "react"
import { useAuth } from "../contexts/authContext"

import clientPromise from "../lib/mongodb"

const Login = ({ events }) => {
  const [selected, setSelected] = useState({})

  const auth = useAuth()

  return (
    <>
      <Head>
        <title>Sitel Planner | Booking</title>
      </Head>
      <div className="mt-auto mb-auto">
        <div className="columns">
          <div className="column is-half has-text-centered mx-auto px-6 pb-6 pt-4 card">
            <h1 className="is-size-4">ADMIN AUTHENTICATION</h1>
            <br />

            {!auth.logged || !auth.user ? (
              <>
                <div className="field">
                  <label className="label">Event</label>
                  <div className="select is-fullwidth">
                    <select
                      onChange={(e) =>
                        setSelected({ ...selected, event: e.target.value })
                      }
                    >
                      {!selected.event && (
                        <option value={null}>{"Select Event"}</option>
                      )}
                      {events &&
                        events.map((event) => (
                          <option key={event._id + "-select"} value={event._id}>
                            {event.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      className="input"
                      onChange={(e) =>
                        setSelected({ ...selected, password: e.target.value })
                      }
                      value={selected.password || ""}
                      type="text"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <br />
                <br />
                <button
                  className="button is-primary"
                  onClick={() =>
                    auth.login({
                      event: selected.event,
                      password: selected.password,
                    })
                  }
                  type="button"
                >
                  LOG IN
                </button>
              </>
            ) : (
              <>
                <h3>You are Logged in</h3>
                <p>User: {auth.user.name}</p>
                <p>ID: {auth.user.id}</p>

                <br></br>

                <button
                  className="button is-danger"
                  onClick={() => auth.logout()}
                  type="button"
                >
                  LOG OUT
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Login

export async function getServerSideProps(context) {
  try {
    // client.db() will be the default database passed in the MONGODB_URI
    // You can change the database by calling the client.db() function and specifying a database like:s
    // const db = client.db("myDatabase");
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    let client = await clientPromise

    const db = client.db("sitel-planner")

    const events = await db.collection("events").find({}).toArray()

    return {
      props: { isConnected: true, events: JSON.parse(JSON.stringify(events)) },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
