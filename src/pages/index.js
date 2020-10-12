import React, { useState, useEffect } from "react"

import { useAuthStatus, loginUser } from "gatsby-plugin-google-gapi"
import { Wizard, Steps, Step } from "react-albus"

import Picker from "react-mobile-picker-scroll"

import moment from "moment"

import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import { findTimeSlot } from "../services/calendar"

const MOMENT_FORMAT = "YYYY-MM-DDTHH:mm:ssZZ"

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

  const [highlightTime, setHighlightTime] = useState({
    valueGroups: {
      hour: 1,
      minutes: 15,
    },
  })

  const handleHighlighTimeChange = (name, value) => {
    setHighlightTime({
      valueGroups: {
        ...highlightTime.valueGroups,
        [name]: value,
      },
    })
  }

  const [freeTimeSlots, setFreeTimeSlots] = useState([])
  useEffect(() => {
    const isBrowser = () => typeof window !== "undefined"
    const getEvents = async () => {
      if (isBrowser() && window.gapi) {
        const events = await window.gapi.client.calendar.events.list({
          calendarId: "primary",
          timeMin: moment().format(MOMENT_FORMAT),
          timeMax: moment().endOf("day").format(MOMENT_FORMAT),
          showDeleted: false,
          singleEvents: true,
          maxResults: 50,
          orderBy: "startTime",
        })

        const nomarlisedEvents = events.result.items.map(event => {
          const { start, end } = event
          return { start, end }
        })
        const freeTimeSlots = findTimeSlot(
          nomarlisedEvents,
          highlightTime.valueGroups,
          moment().set("hour", 18).set("minute", 0)
        )
        setFreeTimeSlots(freeTimeSlots)
      }
    }
    getEvents()
  }, [highlightTime])

  const skip = ({ step, push }) => {
    if (step.id === "setTime" && freeTimeSlots.length === 0) {
      push("noFreeSlots")
    } else {
      push()
    }
  }

  const { authed } = useAuthStatus()

  if (authed) {
    return (
      <Box className={classes.root}>
        <Wizard onNext={skip}>
          <Steps>
            <Step
              id="setHighlights"
              render={({ next }) => (
                <Box className={classes.card}>
                  <Typography variant="h2">
                    What's your highlight of the day?
                  </Typography>
                  <Typography variant="body1">
                    Write down what you really want to get done today. This will
                    be your focus.
                  </Typography>
                  <TextField
                    variant="filled"
                    multiline
                    rows={6}
                    defaultValue="Write your highlight here..."
                    onChange={handleHighlightChangge}
                  />
                  <Button disabled={highlight ? false : true} onClick={next}>
                    Next Step
                  </Button>
                </Box>
              )}
            />
            <Step
              id="setTime"
              render={({ next }) => (
                <Box className={classes.card}>
                  <Typography variant="h2">
                    How much time do you need?
                  </Typography>
                  <Typography>
                    How long do you think it will take you to finish your
                    highlight? This can be anywhere between 15 minutes and 8
                    hours long.
                  </Typography>
                  <Picker
                    optionGroups={{
                      hour: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                      minutes: [0, 15, 30, 45],
                    }}
                    valueGroups={highlightTime.valueGroups}
                    onChange={handleHighlighTimeChange}
                  />
                  <Button
                    disabled={highlightTime ? false : true}
                    onClick={next}
                  >
                    Next Step
                  </Button>
                </Box>
              )}
            />
            <Step
              id="pickTime"
              render={({ next }) => (
                <Box className={classes.card}>
                  <Typography variant="h2">You've got time.</Typography>
                  <Typography>
                    You have {freeTimeSlots.length} time slots to focus on your
                    highlight. Which one do you want to schedule?
                  </Typography>

                  {freeTimeSlots.map((timeSlot, index) => (
                    <p key={index}>
                      {timeSlot.start.format("HH:mm")} -{" "}
                      {timeSlot.end.format("HH:mm")}
                    </p>
                  ))}
                  <Button disabled={true} onClick={next}>
                    Next Step
                  </Button>
                </Box>
              )}
            />
            <Step
              id="noFreeSlots"
              render={({ next }) => (
                <Box className={classes.card}>
                  <Typography variant="h2">
                    You don't have any free time slots.
                  </Typography>
                  <Typography>
                    You don't have any time slots available at the moment. What
                    do you want to do to plan in your highlight?
                  </Typography>
                </Box>
              )}
            />
          </Steps>
        </Wizard>
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
