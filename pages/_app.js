import "bulma/css/bulma.min.css"
import "../styles/globals.css"
import "bulma/css/bulma.css"

import Head from "next/head"

import PageLayout from "../layout/pageLayout"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="description" content="Sitel Planner App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </>
  )
}

export default MyApp
