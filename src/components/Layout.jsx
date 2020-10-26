import React from "react"

import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"

import Navigation from "./Navigation"

const useStyles = makeStyles(theme => ({
  root: {
      height: "90vh"
  },
}))

export default function Layout(props) {
  const { children } = props
  const classes = useStyles()
  const showNav = props.hideNav ? false : true
  return (
    <Box className={classes.root}>
      {showNav && <Navigation />}
      {children}
    </Box>
  )
}
