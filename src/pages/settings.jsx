import React, { useEffect, useState } from "react"

import { makeStyles } from "@material-ui/core/styles"

import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Layout from "../components/Layout"

import globalStyles from "./styles"
import calendar from "../services/calendar"

const useStyles = makeStyles(() => ({
  ...globalStyles,
}))

function useCalendars() {
  const [calendars, setCalendars] = useState()

  useEffect(() => {
    const getCalendars = async () => {
      const calendars = await calendar.getCalendars()
      setCalendars(calendars)
    }
    getCalendars()
  }, [])

  return calendars
}

function CalendarsList() {
  const calendars = useCalendars()
  const classes = useStyles()

  return (
    <Box>
      <Typography variant="h2">Calendars</Typography>
      {calendars &&
        calendars.map((calendar, index) => (
          <Box key={index} m={1} p={0}>
            <Button variant="outlined" className={classes.evenlySpacedCentered}>
              {calendar.summary}
            </Button>
          </Box>
        ))}
    </Box>
  )
}

export default function Settings() {
  return (
    <Layout>
      <Typography variant="h1">Settings</Typography>
      <CalendarsList />
    </Layout>
  )
}
