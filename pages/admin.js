import Head from "next/head"
import { ObjectId } from "mongodb"
import { useAuth } from "../contexts/authContext"

import clientPromise from "../lib/mongodb"
import { useState } from "react"

const Admin = ({ event }) => {
  const [results, setResults] = useState([])

  const auth = useAuth()

  const handleSearch = ({ type, field, value }) => {
    let request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: { type, field, value }, auth: auth }),
    }
    fetch(`/api/admin/search?event=${event._id}`, request)
  }

  return (
    <>
      <Head>
        <title>Sitel Planner | Admin</title>
      </Head>
      <div className="columns">
        <div className="column card is-one-quarter">
          <h1 className="is-size-4">Admin Page for {event.title}</h1>
          <br />
          <div className="field">
            <div className="label">Search Date (yyyy-mm-dd)</div>
            <div className="field is-grouped">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Search Date"
                ></input>
              </div>
              <div className="control">
                <button className="button is-link" type="button">
                  Search
                </button>
              </div>
            </div>
          </div>
          <br />
          {event.fields &&
            event.fields.map((field) => (
              <div className="field">
                <div className="label">Search "{field.name}"</div>
                <div className="field is-grouped">
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="Search Field"
                    ></input>
                  </div>
                  <div className="control">
                    <button className="button is-link" type="button">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="column is-three-quarters has-background-info">
          This is Admin Page for {event.title}
        </div>
      </div>
    </>
  )
}

export default Admin

export async function getServerSideProps({ query }) {
  try {
    // client.db() will be the default database passed in the MONGODB_URI
    // You can change the database by calling the client.db() function and specifying a database like:s
    // const db = client.db("myDatabase");
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    let client = await clientPromise

    console.log(query.user)
    let eventId = query.user

    const db = client.db("sitel-planner")

    const event = await db
      .collection("events")
      .findOne({ _id: ObjectId(eventId) })

    return {
      props: { isConnected: true, event: JSON.parse(JSON.stringify(event)) },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
