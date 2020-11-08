import moment from "moment"

export const MOMENT_FORMAT = "YYYY-MM-DDTHH:mm:ssZZ"

export const END_TIME_MAX = moment("2020-10-16T18:00:00")

export default class EventBuilder {
  events = []

  addEvent(hour, duration) {
    let startDateTime
    if (hour < 10) {
      startDateTime = moment(`2020-10-16T0${hour}:00:00`)
    } else {
      startDateTime = moment(`2020-10-16T${hour}:00:00`)
    }
    this.events.push({
      start: {
        dateTime: startDateTime.format(MOMENT_FORMAT),
        timeZone: "Europe/Madrid",
      },
      end: {
        dateTime: startDateTime
          .clone()
          .add(duration, "h")
          .format(MOMENT_FORMAT),
        timeZone: "Europe/Madrid",
      },
    })
    return this
  }

  addEventWithTime(start, end) {
    this.events.push({
      start: {
        dateTime: moment(start).format(MOMENT_FORMAT),
        timeZone: "Europe/Madrid",
      },
      end: {
        dateTime: moment(end).format(MOMENT_FORMAT),
        timeZone: "Europe/Madrid",
      },
    })
    return this
  }
}
