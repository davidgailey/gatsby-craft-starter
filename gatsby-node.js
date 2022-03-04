const path = require("path")
// const fs = require("fs")
const fs = require("fs-extra")
const _ = require(`lodash`)
const { createFilePath } = require(`gatsby-source-filesystem`)
// const { paginate } = require(`gatsby-awesome-pagination`)

// dsg function that came with starter
exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })
}

// from linkedin learning to generate pages from a data source
// https://github.com/LinkedInLearning/learning-gatsby-3156789
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// const path = require(`path`)
// const _ = require(`lodash`)
// const { createFilePath } = require(`gatsby-source-filesystem`)
// const { paginate } = require(`gatsby-awesome-pagination`)

/**
 * Articles
 */

// Default subject taxonomy to "random" if no subject provided.
// exports.createSchemaCustomization = ({ actions, schema }) => {
//   const { createTypes } = actions
//   const typeDefs = [
//     "type MarkdownRemark implements Node { frontmatter: Frontmatter }",
//     schema.buildObjectType({
//       name: "Frontmatter",
//       fields: {
//         subject: {
//           type: "[String!]",
//           resolve(source, args, context, info) {
//             const { subject } = source
//             if (
//               source.subject == null ||
//               (Array.isArray(subject) && !subject.length)
//             ) {
//               return ["random"]
//             }
//             return subject
//           },
//         },
//       },
//     }),
//   ]
//   createTypes(typeDefs)
// }

// Markdown items: Create slug nodes based on folder
exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === `CraftAPI`) {
    const slug = createFilePath({ node, getNode, basePath: `content` })

    actions.createNodeField({
      node,
      name: `slug`,
      value: `/articles${slug}`,
    })
  }
}

// Generate pages for each article.

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  // Query all the data
  const queryResult = await graphql(`
    {
      articleQuery: craftAPI {
        entries {
          slug
        }
      }
    }
  `)
  if (queryResult.errors) {
    reporter.panic("error loading articles", queryResult.errors)
    return
  }

  // Generate single article pages
  const articles = queryResult.data.articleQuery.entries
  articles.forEach(article => {
    createPage({
      path: article.slug,
      component: path.resolve(`./src/templates/craft-article.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: article.slug,
      },
    })
  })

  // Create your paginated pages
  //   paginate({
  //     createPage, // The Gatsby `createPage` function
  //     items: articles, // An array of objects
  //     itemsPerPage: 2, // How many items you want per page
  //     pathPrefix: "/articles", // Creates pages like `/blog`, `/blog/2`, etc
  //     component: path.resolve(`./src/templates/articles.js`), // Just like `createPage()`
  //   })

  //   const taxonomies = queryResult.data.taxQuery.group
  //   taxonomies.map(({ nodes: articles, fieldValue }) => {
  //     paginate({
  //       createPage, // The Gatsby `createPage` function
  //       items: articles, // An array of objects
  //       itemsPerPage: 2, // How many items you want per page
  //       pathPrefix: `/subjects/${_.kebabCase(fieldValue)}`, // Creates pages like `/blog`, `/blog/2`, etc
  //       component: path.resolve(`./src/templates/subjects.js`), // Just like `createPage()`
  //       context: { subject: fieldValue },
  //     })
  //   })
}

// to move built files from gatsby build dir (public) to craft web/public dir
//https://stackoverflow.com/questions/63276158/i-want-to-gatsby-build-and-deploy-to-a-subdirectory
//https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
// const path = require("path")
// const fs = require("fs")

exports.onPostBuild = function () {
  // Include the fs-extra package
  // var fs = require("fs-extra");

  var source = "public"
  var destination = "../web"

  // Copy the source folder to the destination
  fs.copy(source, destination, function (err) {
    if (err) {
      console.log("An error occurred while copying the folder.")
      return console.error(err)
    }
    console.log("Copy completed!")
  })
}
