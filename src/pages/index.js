import React, { useState } from "react"

import { useAuthStatus, loginUser, logoutUser } from "gatsby-plugin-google-gapi"

import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles(theme => ({
  root: {
    display: "grid",
    placeItems: "center",
    height: "90vh",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    justifyContent: "space-between",
  },
}))

export default function Home() {
  const classes = useStyles()

  const [highlight, setHighlight] = useState()
  const handleHighlightChangge = event => {
    setHighlight(event.target.value)
  }

  const { authed} = useAuthStatus()

  if (authed) {
    return (
      <Box className={classes.root}>
        <Box className={classes.card}>
          <Typography variant="h2">
            What's your highlight of the day?
          </Typography>
          <Typography variant="body1">
            Write down what you really want to get done today. This will be your
            focus.
          </Typography>
          <TextField
            variant="filled"
            multiline
            rows={6}
            defaultValue="Write your highlight here..."
            onChange={handleHighlightChangge}
          />
          <Button disabled={highlight ? false : true}>Next Step</Button>
          
          <Button onClick={x => logoutUser(x)}>logOut</Button>
        </Box>
      </Box>
    )
  } else {
    return (
      <Button variant="contained" color="primary" onClick={loginUser}>
        login
      </Button>
    )
  }
}
