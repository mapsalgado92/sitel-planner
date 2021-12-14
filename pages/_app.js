import "bulma/css/bulma.min.css"
import "../styles/globals.css"
import "bulma/css/bulma.css"

import Head from "next/head"

import PageLayout from "../layout/pageLayout"

import { AuthProvider } from "../contexts/authContext"

import { CookiesProvider } from "react-cookie"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="description" content="Sitel Planner App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <CookiesProvider>
        <AuthProvider>
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
        </AuthProvider>
      </CookiesProvider>
    </>
  )
}

export default MyApp
