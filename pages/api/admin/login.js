import { hashSync, compareSync } from "bcrypt"
import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  const { body, method } = req

  const client = await clientPromise

  const database = client.db("sitel-planner")

  if (method === "GET") {
    let loginEvent = await db
      .collection("events")
      .findOne({ _id: ObjectId(body.event) }, { password: 1 })

    if (loginEvent) {
      compare = compareSync(password, loginEvent.password)
    } else {
    }
  } else {
    res.status(405).json({ message: "Method not Allowed, use GET only" })
  }

  let hashed = hashSync(query.string, 10)

  res.status(200).json({ message: "String Hashed!", data: hashed, compare })
}
