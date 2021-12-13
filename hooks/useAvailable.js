import { useEffect, useState } from "react"

const useAvailable = (event) => {
  const [available, setAvailable] = useState([])

  useEffect(() => {
    updateAvailable(event)
  }, [event])

  const updateAvailable = async (eventId) => {
    let fetched = await fetch(`/api/bookings/available?event=${eventId}`)
      .then((data) => data.json())
      .catch()

    let present = new Date()

    //TEST FEATURE
    let offset = 0

    present.setTime(present.getTime() + offset * 60 * 60 * 1000)

    let newAvailable = fetched.data

    newAvailable.forEach((daily) => {
      Object.keys(daily).forEach((slot) => {
        if (
          present.toISOString() > daily.date + "T" + slot &&
          slot !== "date"
        ) {
          daily[slot] = null
        }
      })
    })

    setAvailable(newAvailable)
  }

  const getTotalAvailable = (date) => {
    let sDaily = available.find((daily) => date === daily.date)

    let total = 0

    sDaily &&
      Object.keys(sDaily).forEach((key) => {
        total += key === "date" ? 0 : sDaily[key]
      })

    return total
  }

  const getDailyAvailable = (date) => {
    let sDaily = available.find((daily) => date === daily.date)

    return sDaily
  }

  return {
    available,
    updateAvailable,
    getTotalAvailable,
    getDailyAvailable,
  }
}

export default useAvailable
