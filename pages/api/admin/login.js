import { compareSync } from "bcrypt"
import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  const { query, method, body } = req

  const client = await clientPromise

  const database = await client.db("sitel-planner")

  if (method === "POST") {
    //FIND EVENT
    const loginEvent = await database
      .collection("events")
      .findOne({ _id: ObjectId(body.event) })

    if (loginEvent && body.password) {
      let compare = compareSync(
        body.password,
        loginEvent ? loginEvent.password : "x"
      )
      if (compare) {
        res.status(200).json({
          message: "Login successful!",
          logged: true,
          user: { id: loginEvent._id, name: loginEvent.title },
        })
      } else {
        res
          .status(200)
          .json({
            message: "Credentials incorrect!",
            logged: false,
            user: null,
          })
      }
    } else {
      res.status(401).json({ message: "Bad Request!" })
    }
  } else {
    res.status(405).json({ message: "Method not Allowed, use POST only" })
  }
}
