import moment from "moment"

const MOMENT_FORMAT = "YYYY-MM-DDTHH:mm:ssZZ"

export const END_TIME_MAX  = moment("2020-10-16T19:00:00")

export default class EventBuilder {
  events = []

  addEvent(start, duration) {
    let startDateTime
    if (start < 10) {
      startDateTime = moment(`2020-10-16T0${start}:00:00`)
    } else {
      startDateTime = moment(`2020-10-16T${start}:00:00`)
    }
    this.events.push({
      start: {
        dateTime: startDateTime.format(MOMENT_FORMAT),
        timeZone: "Europe/Madrid",
      },
      end: {
        dateTime: startDateTime.add(duration, "h").format(MOMENT_FORMAT),
        timeZone: "Europe/Madrid",
      },
    })
    return this
  }
}
