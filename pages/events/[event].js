import { ObjectId } from "mongodb"
import Head from "next/head"
import { useState } from "react"
import useAvailable from "../../hooks/useAvailable"
import SlotsModal from "../../components/SlotsModal"

import clientPromise from "../../lib/mongodb"
import { useRouter } from "next/router"

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const Event = ({ event }) => {
  const router = useRouter()

  const [payload, setPayload] = useState({})

  const [selected, setSelected] = useState({
    daily: null,
    slot: null,
  })

  const available = useAvailable(event && event._id)

  const handleChange = (e, fieldName) => {
    e.preventDefault()

    setPayload({ ...payload, [fieldName]: e.target.value })
  }

  const handleSelectDaily = (daily) => {
    setSelected({ ...selected, daily: available.getDailyAvailable(daily.date) })
  }

  const handleBook = async () => {
    //Field Verification
    let missingField = !selected.slot
    event.fields.forEach((field) => {
      if (!payload[field.name]) {
        missingField = true
      }
    })

    if (missingField) {
      alert("Please fill all the fields on the Information section.")
    } else {
      //Post booking

      let post = {
        event,
        payload,
        date: selected.slot,
      }

      let request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      }

      fetch("/api/bookings/book", request)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          if (data.insert) {
            alert(data.message + "\nBooking ID: " + data.insert.insertedId)
            console.log(data.message)
            available.updateAvailable(event._id)
            setTimeout(
              () => router.push("/bookings/" + data.insert.insertedId),
              200
            )
          } else if (data.verify) {
            alert(
              data.message +
                "\n> Unique: " +
                (data.verify.unique ? "OK" : "NO") +
                "\n>>> Duplicate Status: " +
                (data.verify.uniqueBooking
                  ? data.verify.uniqueBooking.status
                  : "none") +
                "\n> Time: " +
                (data.verify.time ? "OK" : "NO") +
                "\n> Availability: " +
                (data.verify.availability ? "OK" : "NO")
            )
            console.log(data.message)
          } else {
            alert("Something went wrong...")
          }
        })
        .catch()
    }
  }

  return (
    <>
      <Head>
        <title>Sitel Planner | {event && event.title}</title>
      </Head>
      <div className="has-text-left px-4">
        <SlotsModal
          daily={selected.daily}
          active={selected.daily !== null}
          toggle={() => setSelected({ ...selected, daily: null })}
          selectSlot={(slot) => setSelected({ daily: null, slot: slot })}
        ></SlotsModal>
        <div className="card has-background-link-dark has-text-white p-6">
          <div className=" is-justify-content-center">
            <h1 className="is-size-3 has-text-weight-bold">{event.title}</h1>
          </div>
          <br />
          <div>
            <p className="is-size-5">{event.long_description}</p>
          </div>
        </div>

        <br />
        <h1 className="is-size-2">Information</h1>
        <br />

        <div className="columns is-flex-wrap-wrap">
          {event.fields &&
            event.fields.map((field, index) => {
              switch (field.type) {
                case "text":
                  return (
                    <div className="column" key={"field-" + index}>
                      <label className="label">{field.name}</label>
                      <input
                        className="input"
                        type="text"
                        placeholder={field.name}
                        value={payload[field.name] || ""}
                        onChange={(e) => handleChange(e, field.name)}
                      />
                    </div>
                  )
                case "selection":
                  return (
                    <div className="column" key={"field-" + index}>
                      <label className="label">{field.name}</label>
                      <div className="select is-fullwidth">
                        <select
                          onChange={(e) =>
                            setPayload({
                              ...payload,
                              [field.name]: e.target.value,
                            })
                          }
                        >
                          {field.options &&
                            field.options.split(",").map((option, subindex) => (
                              <option
                                key={"field-" + index + "-option-" + subindex}
                                disabled={subindex === 0 && payload[field.name]}
                              >
                                {option}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )
              }
            })}
        </div>

        <br />
        <h1 className="is-size-2">Slots</h1>

        <br />
        {selected.slot && (
          <div className="card has-background-black has-text-white p-3 my-3">
            <div className="columns">
              <div className="column is-two-thirds">
                <h1 className="is-size-4  ">
                  Slot Selected:
                  <span className="mx-4 has-text-weight-bold">
                    {selected.slot
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-") +
                      "   " +
                      selected.slot.split("T")[1].slice(0, 5)}
                  </span>
                </h1>
              </div>
              <div className="column">
                <button
                  className="button is-primary is-fullwidth has-text-weight-bold"
                  onClick={handleBook}
                >
                  BOOK
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="columns is-flex-wrap-wrap">
          {event.availability &&
            event.availability.map((daily) => (
              <div
                key={daily.date + "-selector"}
                className="column is-one-fifth"
              >
                <div className="card">
                  <div className="card-header card-header-title">
                    {daily.date.split("-").reverse().join("-")}
                    <span
                      className={`tag ml-auto ${
                        new Date(daily.date).getDay() === 6
                          ? "is-info"
                          : new Date(daily.date).getDay() === 0
                          ? "is-link"
                          : "is-primary"
                      }`}
                    >
                      {weekdays[new Date(daily.date).getDay()]}
                    </span>
                  </div>
                  <div className="card-content">
                    <p>
                      Available:{" "}
                      <span>{available.getTotalAvailable(daily.date)}</span>
                    </p>
                    <br />
                    <button
                      className="button is-fullwidth is-outlined is-info"
                      onClick={() =>
                        handleSelectDaily(
                          available.getDailyAvailable(daily.date)
                        )
                      }
                    >
                      Check Slots
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <br />

        <br />

        <br />
      </div>
    </>
  )
}

export default Event

export async function getServerSideProps({ params }) {
  try {
    let client = await clientPromise

    const db = client.db("sitel-planner")

    const event = await db
      .collection("events")
      .findOne({ _id: ObjectId(params.event) })

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
