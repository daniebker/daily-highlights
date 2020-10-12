import { findTimeSlot } from "../../src/services/calendar"
import EventBuilder, { END_TIME_MAX } from "../builders/eventBuilder"

describe("given a timespan", () => {
  const timeSpan = { hour: 1, minutes: 15 }

  describe("when there is time after the last event", () => {
    const DAY_WITH_FREE_TIME = new EventBuilder().addEvent(12, 1).events

    it("should return an array of free time slots", () => {
      const result = findTimeSlot(DAY_WITH_FREE_TIME, timeSpan, END_TIME_MAX)
      expect(result.length).toBe(1)
    })
  })

  describe("when highlight ends after max alloted end time", () => {
    const ANOTHER_FULL_CALENDAR = new EventBuilder().addEvent(9, 8).events
    it("should return an empty array", () => {
      const results = findTimeSlot(
        ANOTHER_FULL_CALENDAR,
        timeSpan,
        END_TIME_MAX
      )
      expect(results.length).toBe(0)
    })
  })

  describe("when there are no free time slots", () => {
    const ONE_FULL_DAY_EVENT = new EventBuilder().addEvent(0, 24).events
    const BACK_TO_BACK_EVENTS_ALL__DAY = new EventBuilder()
      .addEvent(9, 2)
      .addEvent(11, 2)
      .addEvent(13, 13).events

    it.each([[ONE_FULL_DAY_EVENT], [BACK_TO_BACK_EVENTS_ALL__DAY]])(
      `should return an empty array for calendar with %o`,
      events => {
        const results = findTimeSlot(events, timeSpan, END_TIME_MAX)
        expect(results.length).toBe(0)
      }
    )
  })
})

// created: "2020-09-16T04:55:03.000Z"
// creator: {email: "bakerdude@gmail.com", self: true}
// end: {dateTime: "2020-10-12T18:30:00+02:00", timeZone: "Europe/Madrid"}
// etag: ""3200464206388000""
// htmlLink: "https://www.google.com/calendar/event?eid=NnV0cTFybm5yM3I1M2YzbzJ2dmNxZzh1OWtfMjAyMDEwMTJUMTIwMDAwWiBiYWtlcmR1ZGVAbQ"
// iCalUID: "6utq1rnnr3r53f3o2vvcqg8u9k@google.com"
// id: "6utq1rnnr3r53f3o2vvcqg8u9k_20201012T120000Z"
// kind: "calendar#event"
// organizer: {email: "bakerdude@gmail.com", self: true}
// originalStartTime: {dateTime: "2020-10-12T14:00:00+02:00", timeZone: "Europe/Madrid"}
// recurringEventId: "6utq1rnnr3r53f3o2vvcqg8u9k"
// reminders: {useDefault: false, overrides: Array(1)}
// sequence: 0
// start: {dateTime: "2020-10-12T14:00:00+02:00", timeZone: "Europe/Madrid"}
// status: "confirmed"
// summary: "Work"
// updated: "2020-09-16T04:55:03.231Z"
