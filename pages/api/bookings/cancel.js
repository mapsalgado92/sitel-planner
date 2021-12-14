import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  const { query, method } = req

  const client = await clientPromise

  const database = client.db("sitel-planner")

  if (method === "PUT") {
    let bookingId = query.booking

    if (!bookingId || bookingId.length != 24) {
      console.log("Invalid ID")
      res.status(400).json({ message: "Invalid ID" })
      return -1
    }

    //Check Booking

    const booking = await database
      .collection("bookings")
      .findOne({ _id: ObjectId(bookingId) })

    if (booking && !booking.closed) {
      try {
        const update = await database
          .collection("bookings")
          .updateOne(
            { _id: ObjectId(bookingId) },
            { $set: { status: "cancelled", closed: true } }
          )
        res
          .status(200)
          .json({ message: "Booking successfully canceled!", update })
      } catch (err) {
        res.status(500).json({ error: err, message: "Something just broke :O" })
      }
    } else {
      res.status(400).json({ message: "Booking is not active!" })
    }
  } else {
    res.status(405).json({ message: "Method not Allowed, use PUT only" })
  }
}
