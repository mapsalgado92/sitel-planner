import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  const { query, method, body } = req

  const client = await clientPromise

  const database = client.db("sitel-planner")

  if (method === "PUT") {
    let bookingId = query.booking
    let comment = body.comment
    let auth = body.auth

    if (!bookingId || bookingId.length != 24) {
      console.log("Invalid ID")
      res.status(400).json({ message: "Invalid ID" })
      return -1
    }

    //Check Booking

    const booking = await database
      .collection("bookings")
      .findOne({ _id: ObjectId(bookingId) })

    if (booking) {
      if (booking.closed) {
        res.status(400).json({ message: "Booking is already closed" })
        return -1
      } else if (!auth || auth.user.id !== booking.event) {
        console.log("Unauthorized Action")
        res.status(401).json({ message: "Unauthorized Action" })
        return -1
      } else {
        try {
          const update = await database.collection("bookings").updateOne(
            { _id: ObjectId(bookingId) },
            {
              $set: {
                status: "completed",
                closed: true,
                comment: comment ? comment : null,
                closed_date: new Date().toISOString(),
              },
            }
          )
          res.status(200).json({ message: "Booking status changed!", update })
        } catch (err) {
          res
            .status(500)
            .json({ error: err, message: "Something just broke :O" })
        }
      }
    } else {
      res.status(400).json({ message: "No booking found!" })
    }
  } else {
    res.status(405).json({ message: "Method not Allowed, use PUT only" })
  }
}
