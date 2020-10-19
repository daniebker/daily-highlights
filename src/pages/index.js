import React, { useState, useEffect } from "react"

import { useAuthStatus, loginUser } from "gatsby-plugin-google-gapi"
import { Wizard, Steps, Step } from "react-albus"

import Picker from "react-mobile-picker-scroll"

import moment from "moment"

import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import { Button } from "gatsby-theme-material-ui"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import calendar from "../services/calendar"

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
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    textTransform: "none",
  },
  timeSelectBox: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignContent: "flex-start",
    alignItems: "center",
  },
}))

export default function Home() {
  const classes = useStyles()

  const [highlight, setHighlight] = useState()
  const handleHighlightChange = event => {
    setHighlight(event.target.value)
  }

  const [highlightTime, setHighlightTime] = useState({
    valueGroups: {
      hour: 1,
      minutes: 15,
    },
  })

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(-1)
  const handleHighlighTimeChange = (name, value) => {
    setHighlightTime({
      valueGroups: {
        ...highlightTime.valueGroups,
        [name]: value,
      },
    })
  }

  const [eventUrl, setEventUrl] = useState()
  const [schedulingEvent, setSchedulingEvent] = useState()
  const handleScheduleEvent = async () => {
    setSchedulingEvent(true)
    const onSuccess = event => {
      setEventUrl(event.htmlLink)
      setSchedulingEvent(false)
    }
    calendar.scheduleHighlightTime(
      freeTimeSlots[selectedTimeSlot],
      highlight,
      onSuccess
    )
  }

  const [freeTimeSlots, setFreeTimeSlots] = useState([])
  useEffect(() => {
    const getEvents = async () => {
      const nomarlisedEvents = await calendar.getEvents()
      const freeTimeSlots = calendar.findTimeSlot(
        nomarlisedEvents,
        highlightTime.valueGroups,
        moment().set("hour", 18).set("minute", 0)
      )
      setFreeTimeSlots(freeTimeSlots)
    }
    getEvents()
  }, [highlightTime])

  const skip = ({ step, push }) => {
    if (step.id === "setTime" && freeTimeSlots?.length === 0) {
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
                    onChange={handleHighlightChange}
                  />
                  <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    disabled={highlight ? false : true}
                    onClick={next}
                    endIcon={<ChevronRightIcon />}
                    fullWidth
                  >
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
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    disabled={highlightTime ? false : true}
                    onClick={next}
                    endIcon={<ChevronRightIcon />}
                  >
                    Next Step
                  </Button>
                </Box>
              )}
            />
            <Step
              id="pickTime"
              render={() => (
                <Box className={classes.card}>
                  <Typography variant="h2">You've got time.</Typography>
                  <Typography>
                    You have {freeTimeSlots.length} time slots to focus on your
                    highlight. Which one do you want to schedule?
                  </Typography>
                  <Box className={classes.timeSelectBox}>
                    {freeTimeSlots.map((timeSlot, index) => {
                      let selectedProps
                      if (index === selectedTimeSlot) {
                        selectedProps = { color: "primary" }
                      }

                      return (
                        <Box key={index} m={1} p={0}>
                          <Button
                            {...selectedProps}
                            className={classes.timeButton}
                            variant="outlined"
                            onClick={() => {
                              setSelectedTimeSlot(index)
                            }}
                          >
                            {moment(timeSlot.start).format("HH:mm")} -{" "}
                            {moment(timeSlot.end).format("HH:mm")}
                          </Button>
                        </Box>
                      )
                    })}
                  </Box>
                  <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    disabled={
                      selectedTimeSlot >= 0 || schedulingEvent ? false : true
                    }
                    onClick={handleScheduleEvent}
                  >
                    Schedule
                  </Button>
                  {eventUrl && <Button href={eventUrl}>View Event</Button>}
                </Box>
              )}
            />
            <Step
              id="noFreeSlots"
              render={() => (
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
      <Box className={classes.root}>
        <Button variant="contained" color="primary" onClick={loginUser}>
          login
        </Button>
      </Box>
    )
  }
}
