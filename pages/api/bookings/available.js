import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  const { query, method } = req

  const client = await clientPromise

  const database = client.db("sitel-planner")

  if (method === "GET") {
    let eventId = query.event

    if (!eventId || eventId.length != 24) {
      console.log("Invalid ID")
      res.status(400).json({ message: "Invalid ID" })
      return -1
    }

    //Check Booking

    const event = await database
      .collection("events")
      .findOne({ _id: ObjectId(eventId) })

    const bookings = await database
      .collection("bookings")
      .find({ event: eventId, status: { $ne: "cancelled" } })
      .sort({ date: 1 })
      .toArray()

    if (event && bookings.length > 0) {
      const available = JSON.parse(JSON.stringify(event.availability))
      bookings.forEach((booking) => {
        let bDaily = available.find((daily) =>
          booking.date.includes(daily.date)
        )
        if (bDaily) {
          bDaily[booking.date.split("T")[1]] -= 1
        } else {
          console.log("no daily was found")
        }
      })

      try {
        res
          .status(200)
          .json({ message: "Request successfully processed!", data: available })
      } catch (err) {
        res.status(500).json({ error: err, message: "Something just broke :O" })
      }
    } else if (event && event.availability) {
      try {
        res.status(200).json({
          message: "Request successfully processed, but no bookings yet.",
          data: event.availability,
        })
      } catch (err) {
        res.status(500).json({ error: err, message: "Something just broke :O" })
      }
    } else {
      res.status(400).json({ message: "No active event found!" })
    }
  } else {
    res.status(405).json({ message: "Method not Allowed, use GET only" })
  }
}
