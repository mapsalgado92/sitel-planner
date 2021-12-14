import { useAuth } from "../contexts/authContext"

const SlotsModal = ({ active, toggle, daily, selectSlot, eventId }) => {
  const auth = useAuth()

  return (
    <div className={`modal has-text-centered ${active ? "is-active" : ""}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            {daily && daily.date.split("-").reverse().join("-")}
          </p>
          <button
            className="delete"
            onClick={toggle}
            aria-label="close"
          ></button>
        </header>
        <section className="modal-card-body">
          <table className="table is-striped is-fullwidth">
            <tbody>
              {daily &&
                Object.keys(daily)
                  .filter((item) => item !== "date")
                  .sort()
                  .map((time) => (
                    <tr key={"row-" + time}>
                      <td className="is-size-5">{time.slice(0, 5)}</td>
                      <td
                        className={`is-size-5 ${
                          daily[time] === 0 && "has-text-danger"
                        }`}
                      >
                        Available: {daily[time]}
                      </td>
                      <td>
                        <button
                          className="button is-primary is-fullwidth"
                          disabled={
                            daily[time] <= 0 &&
                            !(auth.user && auth.user.id === eventId)
                          }
                          onClick={() => {
                            selectSlot(daily.date + "T" + time)
                          }}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </section>
        <footer className="modal-card-foot">
          <button className="button mx-auto" onClick={toggle}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  )
}

export default SlotsModal
