import { ObjectId } from "mongodb"
import Head from "next/head"
import { useRouter } from "next/router"

import clientPromise from "../../lib/mongodb"

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const Booking = ({ booking, event }) => {
  const router = useRouter()
  const handleCancel = async () => {
    //PUT Cancel

    let url = `/api/bookings/cancel?booking=${booking._id}`

    let request = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    }

    fetch(url, request)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        alert(data.message)
        setTimeout(() => router.reload(), 200)
      })
      .catch()
  }

  return (
    <>
      <Head>
        <title>Sitel Planner | Booking</title>
      </Head>
      <div className="my-auto has-text-centered">
        <div className="columns is-flex-wrap-wrap is-justify-content-center">
          <div className="column is-two-thirds">
            <h1 className="is-size-4">
              Please <span className="has-text-danger">BOOKMARK</span> this page
              or <span className="has-text-danger">COPY THE LINK</span> so you
              can access it in the future!
            </h1>
          </div>

          <div className="column is-two-thirds px-6 pb-6 pt-4 card">
            {booking ? (
              <div>
                <p className="is-size-5 has-text-right pb-4">
                  <span
                    className={`tag ${
                      booking.status === "cancelled"
                        ? "is-danger"
                        : booking.status === "pending"
                        ? "is-warning"
                        : booking.status === "booked"
                        ? "is-primary"
                        : "is-dark"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
                <h1 className="is-size-3">
                  Booking ID:{" "}
                  <span className="has-text-link">{booking._id}</span>
                </h1>
                <h3 className=" is-size-4 ">
                  <span className="has-text-link has-text-weight-bold">
                    {event.title}
                  </span>
                </h3>
                <p className=" is-size-5 ">
                  Date:{" "}
                  <span className="has-text-link has-text-weight-bold">
                    {booking.date.split("T")[0].split("-").reverse().join("-")}
                  </span>
                </p>
                <p className=" is-size-5 ">
                  Slot:{" "}
                  <span className="has-text-link has-text-weight-bold">
                    {booking.date.split("T")[1].slice(0, 5)}
                  </span>
                </p>
                <br />
                <p>{event.short_description}</p>
                <br />
                <button
                  className="button is-danger has-text-weight-bold"
                  onClick={() => handleCancel()}
                  disabled={booking.closed}
                >
                  Cancel Booking
                </button>
              </div>
            ) : (
              <h1 className="title is-size-3">
                Booking ID:{" "}
                <span className="has-text-link">No booking with this ID.</span>
              </h1>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Booking

export async function getServerSideProps({ params }) {
  try {
    let client = await clientPromise

    const db = client.db("sitel-planner")

    const booking = await db.collection("bookings").findOne({
      _id: params.booking.length === 24 ? ObjectId(params.booking) : 0,
    })

    const event = await db
      .collection("events")
      .findOne({ _id: booking ? ObjectId(booking.event) : 0 })

    return {
      props: {
        isConnected: true,
        booking: booking ? JSON.parse(JSON.stringify(booking)) : null,
        event: event ? JSON.parse(JSON.stringify(event)) : null,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
