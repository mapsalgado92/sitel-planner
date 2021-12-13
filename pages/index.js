import Head from "next/head"

export default function Home() {
  return (
    <>
      <Head>
        <title>Sitel Planner</title>
      </Head>

      <div className="is-align-self-center mt-auto mb-auto has-text-centered">
        <h1 className="title is-size-1 ">
          Welcome to <span className="has-text-link">Sitel</span> Planner
        </h1>
      </div>
    </>
  )
}
