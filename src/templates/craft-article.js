import * as React from "react"
import { graphql, Link } from "gatsby"
import _ from "lodash"

import Layout from "../components/layout"
import Seo from "../components/seo"

const Article = ({ data }) => {
  const article = data.craftAPI
  console.log(article)

  return (
    <Layout>
      <Seo title="Page two" />
      <h1>{article.entries[0].title}</h1>
      <p>{article.entries[0].slug}</p>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default Article

export const query = graphql`
  query ($slug: [String]) {
    craftAPI {
      entries(slug: $slug) {
        title
        uri
        slug
      }
    }
  }
`
