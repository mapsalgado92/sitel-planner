const SlotsModal = ({ active, toggle, daily, selectSlot }) => {
  return (
    <div className={`modal ${active ? "is-active" : ""}`}>
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
                    <tr>
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
                          disabled={daily[time] <= 0}
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
