import { ObjectId } from "mongodb"
import Head from "next/head"
import { useState } from "react"
import useAvailable from "../../hooks/useAvailable"
import SlotsModal from "../../components/SlotsModal"

import clientPromise from "../../lib/mongodb"
import { useRouter } from "next/router"
import { useAuth } from "../../contexts/authContext"

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const Event = ({ event }) => {
  const router = useRouter()
  const auth = useAuth()

  const [payload, setPayload] = useState({})

  const [selected, setSelected] = useState({
    daily: null,
    slot: null,
  })

  const [check, setCheck] = useState({})

  const available = useAvailable(event && event._id)

  const handleChange = (e, fieldName) => {
    e.preventDefault()

    setCheck({ ...check, [fieldName]: null })

    setPayload({ ...payload, [fieldName]: e.target.value })
  }

  const handleSelectDaily = (daily) => {
    setSelected({ ...selected, daily: available.getDailyAvailable(daily.date) })
  }

  const handleBook = async () => {
    //Field Verification
    let missingField = !selected.slot
    let missingCheck = false
    event.fields.forEach((field) => {
      if (!payload[field.name]) {
        missingField = true
      } else if (field.check && !check[field.name]) {
        missingCheck = true
      }
    })

    if (missingField) {
      alert("Please fill all the fields on the Information section.")
      return -1
    } else if (missingCheck) {
      alert("Please make sure to CHECK all eligible fields")
      return -1
    }

    //Post booking

    let post = {
      event,
      payload,
      date: selected.slot,
      auth: { user: auth.user, logged: auth.logged },
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
              (data.verify.unique
                ? "OK"
                : "NO: Another booking exists with same unique field...") +
              "\n>>> Duplicate Status: " +
              (data.verify.uniqueBooking
                ? data.verify.uniqueBooking.status
                : "none") +
              "\n> Time: " +
              (data.verify.time
                ? "OK"
                : "NO: Booking can't be set so close to the date...") +
              "\n> Availability: " +
              (data.verify.availability
                ? "OK"
                : "NO: Slot is no longer available...")
          )
          console.log(data.message)
        } else {
          alert("Something went wrong...")
        }
      })
      .catch()
  }

  return (
    <>
      <Head>
        <title>Sitel Planner | {event && event.title}</title>
      </Head>
      <div className="has-text-left p-2">
        <SlotsModal
          daily={selected.daily}
          active={selected.daily !== null}
          toggle={() => setSelected({ ...selected, daily: null })}
          selectSlot={(slot) => setSelected({ daily: null, slot: slot })}
          eventId={event._id}
        ></SlotsModal>
        <div className="card has-background-link-dark has-text-white p-4">
          <div className=" is-justify-content-center">
            <h1 className="is-size-5 has-text-weight-bold">
              {event && event.title}
            </h1>
          </div>
          <br />
          <div>
            <p className="is-size-7">{event && event.long_description}</p>
          </div>
        </div>
        <br />
        <br />
        <h1 className="is-size-5">Information</h1>
        <br />

        <div className="columns is-flex-wrap-wrap">
          {event.fields &&
            event.fields.map((field, index) => {
              switch (field.type) {
                case "text":
                  return (
                    <div className="column" key={"field-" + index}>
                      <div className="field">
                        <label className="label">{field.name}</label>
                        <div className="control field has-addons">
                          <input
                            className="input is-small"
                            type="text"
                            placeholder={field.name}
                            value={payload[field.name] || ""}
                            onChange={(e) => handleChange(e, field.name)}
                          />

                          {field.check && (
                            <>
                              <input
                                className={`input is-small ml-2 ${
                                  check[field.name]
                                    ? "has-text-link"
                                    : "has-text-danger"
                                }`}
                                type="text"
                                disabled={true}
                                value={check[field.name] || "unchecked"}
                              />
                              <button
                                className="ml-2 button is-small is-info is-outlined"
                                type="button"
                                onClick={() => {
                                  fetch(field.check.endpoint)
                                    .then((res) => res.json())
                                    .then((data) => {
                                      console.log(data)
                                      let value = data.find(
                                        (item) =>
                                          item[field.check.key] ===
                                          payload[field.name]
                                      )
                                      if (value) {
                                        setCheck({
                                          ...check,
                                          [field.name]:
                                            value[field.check.output],
                                        })
                                      } else {
                                        setCheck({
                                          ...check,
                                          [field.name]: null,
                                        })
                                      }
                                    })
                                    .catch(() => {
                                      setCheck({
                                        ...check,
                                        [field.name]: null,
                                      })
                                    })
                                }}
                              >
                                Check {field.name}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                case "selection":
                  return (
                    <div className="column" key={"field-" + index}>
                      <label className="label">{field.name}</label>
                      <div className="select is-small is-fullwidth">
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
        <h1 className="is-size-5">Slots</h1>

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
                  className="button is-primary is-small is-fullwidth has-text-weight-bold"
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
                <div className="card is-size-6">
                  <div className="card-header card-header-title">
                    {daily.date && daily.date.split("-").reverse().join("-")}
                    <span
                      className={`tag  is-small ml-auto ${
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
                      className="button is-small is-fullwidth is-outlined is-info"
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
