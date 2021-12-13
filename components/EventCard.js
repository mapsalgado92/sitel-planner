import Image from "next/image"
import Link from "next/link"

const EventCard = ({ event }) => {
  return (
    <div className="card">
      <div className="card-header">
        <p className="card-header-title is-size-4">{event.title}</p>
      </div>
      <div className="card-image">
        <figure className="image is-3by1">
          <Image
            src={event.image}
            alt="card-image"
            layout="fill"
            objectFit="cover"
          />
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          <p className="is-size-5">{event.short_description}</p>
          <span className="has-text-link">
            {event.start_date.split("T")[0]}
          </span>
          {" to "}
          <span className="has-text-link">{event.end_date.split("T")[0]}</span>
        </div>

        <Link href={`/events/${event._id}`}>
          <a>
            <button className="button is-fullwidth is-info">Go To Event</button>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default EventCard
