import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  const { query, method, body } = req

  const client = await clientPromise

  const database = client.db("sitel-planner")

  if (method === "POST") {
    let eventId = query.event
    let search = body.search
    let auth = body.auth

    if (!eventId || eventId.length != 24) {
      console.log("Invalid ID")
      res.status(400).json({ message: "Invalid ID" })
      return -1
    }

    //Check Booking

    const event = await database
      .collection("events")
      .findOne({ _id: ObjectId(eventId) })

    if (event) {
      if (!auth || auth.user.id !== event._id.toString()) {
        console.log("Unauthorized Action")
        res.status(401).json({ message: "Unauthorized Action" })
        return -1
      } else {
        try {
          let searchQuery = { event: eventId }
          if (search.type === "date") {
            searchQuery = { ...searchQuery, date: { $regex: search.value } }
            console.log("DATE QUERY", searchQuery)
          } else if (search.type === "field") {
            searchQuery = {
              ...searchQuery,
              ["payload." + search.field]: { $regex: search.value },
            }
            console.log("FIELD QUERY", searchQuery)
          }
          const result = await database
            .collection("bookings")
            .find(searchQuery)
            .sort({ date: 1 })
            .toArray()
          console.log(result)
          res.status(200).json({ message: `Found ${result.length}`, result })
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
    res.status(405).json({ message: "Method not Allowed, use POST only" })
  }
}
