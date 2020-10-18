require("dotenv").config()

/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    `gatsby-theme-material-ui`,
    {
      resolve: `gatsby-plugin-google-gapi`,
      options: {
        apiKey: process.env.API_KEY,
        clientId: process.env.CLIENT_ID,
        discoveryURLs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scopes: ["https://www.googleapis.com/auth/calendar"],
      },
    },
  ],
}
