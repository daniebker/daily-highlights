import moment from "moment"

const GOOGLE_FORMAT = "YYYY-MM-DDTHH:mm:ssZZ"

const findTimeSlot = (calendarItems, timeSpan, endTimeMax) => {
  if (calendarItems?.length === 0 || calendarItems === undefined) {
    return getFromNowUntilEndTime(timeSpan, endTimeMax)
  }
  const freeSlots = findFreeTimeSlots(calendarItems, timeSpan, endTimeMax)

  return freeSlots
}

const scheduleHighlightTime = async (time, description, callback) => {
  if (isBrowser() && window.gapi?.client?.calendar && time && description) {
    const highlightEvent = {
      summary: "Highlight Time",
      description,
      start: {
        dateTime: time.start.format(GOOGLE_FORMAT),
      },
      end: {
        dateTime: time.end.format(GOOGLE_FORMAT),
      },
      attendees: [
        {
          email: window.gapi.auth2
            .getAuthInstance()
            .currentUser.get()
            .getBasicProfile()
            .getEmail(),
        },
      ],
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 10 }],
      },
    }

    var request = window.gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: highlightEvent,
    })

    request.execute(event => {
      callback(event)
    })
  }
}

const getCalendars = async () => {
  if (isBrowser && window.gapi?.client?.calendar) {
    const calendars = await window.gapi.client.calendar.calendarList.list()
    console.log("calendars", calendars)
    return calendars.result.items.map(item => {
      return {
        backGroundColor: item.backGroundColor,
        description: item.description,
        foregroundColor: item.foregroundColor,
        summary: item.summary,
        timeZone: item.timeZone,
      }
    })
  }
}

const getEvents = async () => {
  if (isBrowser() && window.gapi?.client?.calendar) {
    const events = await window.gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: moment().format(GOOGLE_FORMAT),
      timeMax: moment().endOf("day").format(GOOGLE_FORMAT),
      showDeleted: false,
      singleEvents: true,
      maxResults: 50,
      orderBy: "startTime",
    })

    return events.result.items.map(event => {
      const { start, end } = event
      return { start, end }
    })
  }
}

const isBrowser = () => typeof window !== "undefined"

const thereIsNotAnEventAfterThis = (calendarItems, index) => {
  return !calendarItems[index + 1]
}

const thereIsAnEventAfterThis = (calendarItems, index) => {
  return !thereIsNotAnEventAfterThis(calendarItems, index)
}

const highlightEndsBeforeEndTimeMax = (highlightEndTime, endTimeMax) => {
  return moment(highlightEndTime).isSameOrBefore(endTimeMax)
}

function findFreeTimeSlots(calendarItems, timeSpan, endTimeMax) {
  return calendarItems.reduce((results, item, index) => {
    const highlightEndTime = moment(item.end.dateTime)
      .add(timeSpan.hour, "hours")
      .add(timeSpan.minutes, "minutes")

    if (
      thereIsNotAnEventAfterThis(calendarItems, index) &&
      highlightEndsBeforeEndTimeMax(highlightEndTime, endTimeMax)
    ) {
      results.push({
        start: item.end.dateTime,
        end: highlightEndTime,
      })
    } else if (thereIsAnEventAfterThis(calendarItems, index)) {
      addTimeGaps(index, results, item, highlightEndTime)
    }
    return results
  }, [])

  function addTimeGaps(index, results, item, highlightEndTime) {
    const timeGap = moment.duration(
      moment(calendarItems[index + 1].start.dateTime).diff(
        moment(calendarItems[index].end.dateTime)
      )
    )

    if (timeGap.asMinutes() >= timeSpan.hour * 60 + timeSpan.minutes) {
      results.push({
        start: moment(item.end.dateTime),
        end: highlightEndTime,
      })
    }
  }
}

function getFromNowUntilEndTime(timeSpan, endTimeMax) {
  const results = []
  let highlightStartTime = moment()
  let highlightEndTime = highlightStartTime
    .clone()
    .add(timeSpan.hour, "hours")
    .add(timeSpan.minutes, "minutes")
  while (highlightEndsBeforeEndTimeMax(highlightEndTime, endTimeMax)) {
    results.push({ start: highlightStartTime, end: highlightEndTime })
    highlightStartTime = moment(highlightEndTime)
    highlightEndTime = highlightStartTime
      .clone()
      .add(timeSpan.hour, "hours")
      .add(timeSpan.minutes, "minutes")
  }
  return results
}

export default {
  getEvents,
  scheduleHighlightTime,
  findTimeSlot,
  getCalendars,
}
