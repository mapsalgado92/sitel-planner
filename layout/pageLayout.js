import Footer from "./footer"
import Header from "./header"

const PageLayout = ({ children }) => {
  return (
    <>
      <Header />

      <main className="container">{children}</main>

      <Footer />
    </>
  )
}

export default PageLayout
