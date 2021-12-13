import Head from "next/head"

import EventCard from "../../components/EventCard"
import clientPromise from "../../lib/mongodb"

const Events = ({ events }) => {
  return (
    <>
      <Head>
        <title>Sitel Planner | Events</title>
      </Head>
      <div className="has-text-centered ">
        <h1 className="title is-size-2 ">Events</h1>
        <div className="columns is-justify-content-center is-flex-wrap-wrap ">
          {events &&
            events.map((event) => (
              <div key={"event-" + event._id} className="column is-two-thirds">
                <EventCard key={event._id} event={event}></EventCard>
              </div>
            ))}
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
