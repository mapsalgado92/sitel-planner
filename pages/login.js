import Head from "next/head"

import clientPromise from "../lib/mongodb"

const Events = ({ events }) => {
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

            <div className="field">
              <label class="label">Event</label>
              <div className="select is-fullwidth">
                <select>
                  {events &&
                    events.map((event) => (
                      <option onChange={2} value={event._id}>
                        {event.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label class="label">Password</label>
              <div className="control">
                <input className="input" type="text" placeholder="Password" />
              </div>
            </div>
            <br />
            <button className="button is-primary" type="button">
              LOG IN
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Events

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
