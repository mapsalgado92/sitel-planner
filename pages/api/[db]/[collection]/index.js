import clientPromise from "../../../../lib/mongodb"

export default async function handler(req, res) {
  const {
    query: { db, collection },
    method,
    body,
  } = req

  const client = await clientPromise

  const database = client.db(db)

  if (method === "GET") {
    const { findQuery } = req.body

    try {
      let output = await database
        .collection(collection)
        .find(findQuery ? findQuery : {})
        .toArray()
      console.log(`Item Fetched from ${db} > ${collection}`)
      switch (output.length) {
        case 0:
          res.status(404).json({ message: "No items found :O" })
          break
        default:
          res.status(200).json(output)
      }
    } catch (err) {
      res.status(500).json({ error: "Something just broke..." })
    }
  }
  if (method === "POST") {
    let newData = body.item
    console.log("New Data > ", newData)

    try {
      await database.collection(collection).insertOne(newData)
      res.status(200).json(newData)
      console.log(`Item Added to ${db} > ${collection}`)
    } catch (err) {
      res.status(500).json({ error: "Something just broke..." })
    }
  }
}
