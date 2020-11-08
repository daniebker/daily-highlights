import React, { useEffect, useState } from "react"

import { makeStyles, withStyles, } from "@material-ui/core/styles"

import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Layout from "../components/Layout"

import globalStyles from "./styles"
import calendar from "../services/calendar"
import { CookiesProvider, useCookies } from "react-cookie"

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

  const [cookies, setCookie] = useCookies(["selectedCalendars"])
  const saveCalendar = calendarId => {
    let selectedCalendars = cookies.selectedCalendars || []

    if (selectedCalendars.includes(calendarId)) {
      const index = selectedCalendars.indexOf(calendarId)
      if (index > -1) {
        selectedCalendars.splice(index, 1)
      }
    } else {
      selectedCalendars.push(calendarId)
    }

    setCookie(`selectedCalendars`, selectedCalendars, { path: "/" })
  }

  return (
    <CookiesProvider>
      <Box>
        <Typography variant="h2">Calendars</Typography>
        {calendars &&
          calendars.map((calendar, index) => {
            let ColorButton
            if (
              cookies.selectedCalendars &&
              cookies.selectedCalendars.includes(calendar.id)
            ) {
              ColorButton = withStyles(theme => ({
                root: {
                  color: theme.palette.getContrastText(calendar.backgroundColor),
                  backgroundColor: calendar.backgroundColor,
                  "&:hover": {
                    backgroundColor: "primary",
                  },
                },
              }))(Button)
            } else {
              ColorButton = Button
            }

            return (
              <Box key={index} m={1} p={0}>
                <ColorButton
                  variant="outlined"
                  className={classes.evenlySpacedCentered}
                  onClick={() => {
                    saveCalendar(calendar.id)
                  }}
                >
                  {calendar.summary}
                </ColorButton>
              </Box>
            )
          })}
      </Box>
    </CookiesProvider>
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
