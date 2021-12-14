import { useState } from "react"

const CompleteModal = ({ active, toggle, complete, booking }) => {
  const [comment, setComment] = useState("")
  return (
    <div className={`modal has-text-centered ${active ? "is-active" : ""}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Mark Complete</p>
          <button
            className="delete"
            onClick={toggle}
            aria-label="close"
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label>Leave a Comment</label>
            <div className="control">
              <textarea
                className="textarea has-fixed-size"
                placeholder="Leave a Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            className="button mx-auto"
            onClick={() => {
              complete(booking, comment)
              toggle()
            }}
          >
            Submit
          </button>
        </footer>
      </div>
    </div>
  )
}

export default CompleteModal
