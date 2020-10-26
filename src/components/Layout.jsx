import React from "react"

import { useAuthStatus, loginUser } from "gatsby-plugin-google-gapi"

import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import { Button } from "gatsby-theme-material-ui"

import Navigation from "./Navigation"
import globalStyles from "../pages/styles"

const useStyles = makeStyles(theme => ({
  ...globalStyles,
  root: {
    height: "90vh",
  },
}))

function LoginBlock() {
  const classes = useStyles()
  return (
    <Box className={classes.centered}>
      <Button variant="contained" color="primary" onClick={loginUser}>
        login
      </Button>
    </Box>
  )
}

function DefaultLayout({ children }) {
    const classes = useStyles()
    return (
      <Box className={classes.root}>
        <Navigation />
        {children}
      </Box>
    )
  }

export default function Layout(props) {
  const { children } = props

  const { authed } = useAuthStatus()

  if (authed) {
    return <DefaultLayout>{children}</DefaultLayout>
  } else {
    return <LoginBlock />
  }
}
