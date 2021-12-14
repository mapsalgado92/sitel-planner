import Head from "next/head"
import { ObjectId } from "mongodb"
import { useAuth } from "../contexts/authContext"

import clientPromise from "../lib/mongodb"
import { useState } from "react"
import Link from "next/link"
import CompleteModal from "../components/CompleteModal"

import ReactTooltip from "react-tooltip"

const Admin = ({ event }) => {
  const [result, setResult] = useState([])

  const [searched, setSearched] = useState("")

  const [lastSearch, setLastSearch] = useState("")

  const [values, setValues] = useState({ date: null })

  const [modal, setModal] = useState({
    active: false,
    booking: null,
  })

  const auth = useAuth()

  const handleSearch = async ({ type, field, value }) => {
    let request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: { type, field, value }, auth: auth }),
    }
    let bookings = await fetch(`/api/admin/search?event=${event._id}`, request)
      .then((res) => res.json())
      .then((data) => {
        setResult(data.result)
        setLastSearch({ type, field, value })
        setSearched(field)
      })
      .catch()
  }

  const handleCancel = async (booking) => {
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
        handleSearch(lastSearch)
      })
      .catch()
  }

  const handleComplete = (booking, comment) => {
    //PUT Cancel

    let url = `/api/admin/complete?booking=${booking._id}`

    let request = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth: auth,
        comment: comment,
      }),
    }
    console.log("WHAAAAAAY")
    fetch(url, request)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        alert(data.message)
        handleSearch(lastSearch)
      })
      .catch()
  }

  const handleChange = (e, field) => {
    setValues({ ...values, [field]: e.target.value })
  }

  return (
    <>
      <Head>
        <title>Sitel Planner | Admin</title>
      </Head>

      <div className="columns">
        <ReactTooltip />
        <CompleteModal
          toggle={() => setModal({ active: false, booking: null })}
          active={modal.active}
          booking={modal.booking}
          complete={handleComplete}
        />
        <div className="column box is-full-tablet is-one-third-desktop is-size-7 is-one-quarter-widescreen">
          <div className="px-2 is-size-7">
            <h1 className="is-size-6">Admin Page for {event.title}</h1>
            <br />
            <div className="field is-small">
              <label className="label is-size-7">
                Search Date (yyyy-mm-dd)
              </label>
              <div className="field is-grouped is-small">
                <div className="control is-expanded">
                  <input
                    className={`input is-small ${
                      searched === "date" && "is-danger"
                    }`}
                    onChange={(e) => handleChange(e, "date")}
                    type="text"
                    value={values["date"] ? values["date"] : ""}
                    placeholder="Search Date"
                  ></input>
                </div>
                <div className="control">
                  <button
                    className="button is-link is-small"
                    type="button"
                    disabled={!values["date"]}
                    onClick={() =>
                      handleSearch({
                        type: "date",
                        value: values["date"],
                        field: "date",
                      })
                    }
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {event.fields &&
              event.fields.map((field) => (
                <div className="field" key={field.name + "-field-search"}>
                  <label className="label is-small">
                    Search "{field.name}"
                  </label>
                  <div className="field is-grouped">
                    <div className="control is-expanded ">
                      <input
                        className={`input is-small ${
                          searched === field.name && "is-danger"
                        }`}
                        type="text"
                        placeholder="Search Field"
                        value={values[field.name] ? values[field.name] : ""}
                        onChange={(e) => handleChange(e, field.name)}
                      ></input>
                    </div>
                    <div className="control ">
                      <button
                        className="button is-info is-small"
                        onClick={() =>
                          handleSearch({
                            type: "field",
                            value: values[field.name] || "",
                            field: field.name,
                          })
                        }
                        disabled={!values[field.name]}
                        type="button"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            <button
              className="button is-black is-small"
              onClick={() => {
                setSearched("")
                setValues({ date: null })
                setResult([])
              }}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="column py-0">
          <table className="table is-fullwidth is-size-7 has-text-centered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Slot</th>
                <th>Created</th>
                <th>Status</th>
                <th>Closed</th>
                {event &&
                  event.fields.map((field, index) => (
                    <th key={field + "-header-" + index}>{field.name}</th>
                  ))}
                <th>Actions</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {result &&
                result.map((booking) => (
                  <tr key={booking._id} className="table-row p-3 ">
                    <td>{booking.date.slice(0, 10)}</td>
                    <td>{booking.date.slice(11, 16)}</td>
                    <td>{booking.created.slice(0, -8)}</td>
                    <td>
                      <div
                        className={`tag is-small ${
                          booking.status === "booked"
                            ? "is-primary"
                            : booking.status === "cancelled"
                            ? "is-danger"
                            : booking.status === "completed"
                            ? "is-black"
                            : ""
                        }`}
                      >
                        {booking.status}
                      </div>
                    </td>
                    <td>{booking.closed ? "TRUE" : "FALSE"}</td>
                    {event &&
                      event.fields.map((field, index) => (
                        <td key={field + "-of-" + booking._id + index}>
                          {booking.payload[field.name]}
                        </td>
                      ))}
                    <td>
                      <Link href={`bookings/${booking._id}`}>
                        <button className="button is-info is-rounded is-fullwidth-mobile is-small">
                          go to
                        </button>
                      </Link>
                      <button
                        onClick={() => handleCancel(booking)}
                        className="button is-danger is-rounded is-fullwidth-mobile is-small"
                        disabled={booking.closed}
                      >
                        cancel
                      </button>
                      <button
                        onClick={() =>
                          setModal({ active: true, booking: booking })
                        }
                        disabled={booking.closed}
                        className="button is-success is-rounded is-fullwidth-mobile is-small"
                      >
                        complete
                      </button>
                    </td>
                    <td>
                      {booking.comment ? (
                        booking.comment
                      ) : (
                        <span className="has-text-danger">none</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
