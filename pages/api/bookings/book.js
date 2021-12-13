import clientPromise from "../../../lib/mongodb"

export default async function handler(req, res) {
  const { query, method, body } = req

  const client = await clientPromise

  const database = client.db("sitel-planner")

  if (method === "POST") {
    let event = body.event

    if (!event) {
      console.log("NO EVENT")
      res.status(400).json({ message: "NO EVENT" })
      return -1
    }
    let date = body.date
    if (!date) {
      console.log("NO DATE")
      res.status(400).json({ message: "NO DATE" })
      return -1
    }

    let payload = body.payload
    if (!payload) {
      console.log("NO PAYLOAD")
      res.status(400).json({ message: "NO PAYLOAD" })
      return -1
    }

    let verify = {
      global: true,
    }

    //Check time

    let bufferTime = new Date(
      new Date().getTime() + event.buffer * 60 * 60 * 1000
    ).toISOString()

    if (date > bufferTime) {
      verify.time = true
      console.log("Valid Time")
    } else {
      verify.time = false
      verify.global = false
      console.log("Invalid Time")
    }

    //Check Availability

    let daily = event.availability
      ? event.availability.find((daily) => daily.date === date.split("T")[0])
      : null

    let slots = daily ? daily[date.split("T")[1]] : 0

    let booked = await database
      .collection("bookings")
      .find({ event: event._id, date: date, status: { $ne: "cancelled" } })
      .count()

    let bookedArray = await database
      .collection("bookings")
      .find({ event: event._id, date: date })
      .toArray()

    console.log("BOOKED", booked, "/", slots)

    if (!slots || booked >= slots) {
      verify.availability = false
      verify.global = false
      console.log("Invalid Slot")
    } else {
      verify.availability = true
      console.log("Valid Slot")
    }

    //Check Unique Fields

    let payloadQueries = []

    event.fields.forEach((field) => {
      if (field.unique) {
        payloadQueries.push({
          event: event._id,
          ["payload." + field.name]: payload[field.name],
        })
      }
    })

    let unique = await database
      .collection("bookings")
      .find({ status: { $ne: "cancelled" }, $or: payloadQueries })
      .toArray()

    console.log("UNIQUE", unique)

    if (unique.length) {
      verify.unique = false
      verify.uniqueBooking = unique[0]
      verify.global = false
      console.log("Invalid Duplicate Check")
    } else {
      verify.unique = true
      console.log("Valid Duplicate Check")
    }

    if (verify.global) {
      let newBooking = {
        payload: payload,
        created: new Date().toISOString(),
        delivered: null,
        status: "booked",
        event: event._id,
        process: "book",
        date: date,
      }

      try {
        let insert = await database.collection("bookings").insertOne(newBooking)
        res
          .status(200)
          .json({ message: "Booking successfully submitted!", verify, insert })
      } catch (err) {
        res.status(500).json({ error: err, message: "Something just broke :O" })
      }
    } else {
      res.status(400).json({
        message: "Verificaion failed!",
        verify,
      })
    }
  } else {
    res.status(405).json({ message: "Method not Allowed, use POST only" })
  }
}
