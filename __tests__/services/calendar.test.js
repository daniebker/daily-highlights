import calendar from "../../src/services/calendar"
import EventBuilder, {
  END_TIME_MAX,
  MOMENT_FORMAT,
} from "../builders/eventBuilder"
import moment from "moment"
import MockDate from "mockdate"

describe("given a timespan", () => {
  beforeEach(() => {
    MockDate.set("2020-10-16T09:00:00")
  })
  const oneHourFifteenMinutes = { hour: 1, minutes: 15 }

  describe("when there is time before the first event", () => {
    it("should return the first time", () => {
      const TIME_BEFORE_FIRST_EVENT = new EventBuilder().addEvent(11, 18).events

      const result = calendar.findTimeSlot(
        TIME_BEFORE_FIRST_EVENT,
        oneHourFifteenMinutes,
        END_TIME_MAX
      )
      expect(result.length).toBe(1)
    })

    describe("when there are multiple slots before the first event", () => {
      const thirtyMiniutes = { hour: 0, minutes: 30 }
      it("should reutrn multiple free slots", () => {
        const TIME_BEFORE_FIRST_EVENT = new EventBuilder().addEvent(10, 18)
          .events

        const result = calendar.findTimeSlot(
          TIME_BEFORE_FIRST_EVENT,
          thirtyMiniutes,
          END_TIME_MAX
        )
        expect(result.length).toBe(2)
        expect(result[0].start.format(MOMENT_FORMAT)).toStartWith(
          "2020-10-16T09:00:00"
        )
        expect(result[1].start.format(MOMENT_FORMAT)).toStartWith(
          "2020-10-16T09:30:00"
        )
      })
    })
  })

  describe("when an event spans to the next day", () => {
    const EVENT_UNTIL_NETXT_DAY = new EventBuilder()
      .addEventWithTime("2020-10-16T09:00:00", "2020-10-16T17:00:00")
      .addEventWithTime("2020-10-16T18:30:00", "2020-10-17T06:30:00").events

    it("should only take into account the start time", () => {
      const result = calendar.findTimeSlot(
        EVENT_UNTIL_NETXT_DAY,
        oneHourFifteenMinutes,
        END_TIME_MAX
      )
      expect(result.length).toBe(1)
    })
  })

  describe("when there is time after the last event", () => {
    const DAY_WITH_FREE_TIME = new EventBuilder()
      .addEventWithTime("2020-10-16T09:00:00", "2020-10-16T12:00:00")
      .addEventWithTime("2020-10-16T12:00:00", "2020-10-16T13:00:00").events

    it("should return an array of free time slots", () => {
      const result = calendar.findTimeSlot(
        DAY_WITH_FREE_TIME,
        oneHourFifteenMinutes,
        END_TIME_MAX
      )
      expect(result.length).toBe(1)
    })
  })

  describe("when there is time between events", () => {
    const TIME_BETWEEN_EVENTS = new EventBuilder()
      .addEvent(9, 3)
      .addEvent(12, 1)
      .addEvent(15, 18).events

    it("should return an array of free time slots", () => {
      const result = calendar.findTimeSlot(
        TIME_BETWEEN_EVENTS,
        oneHourFifteenMinutes,
        END_TIME_MAX
      )
      expect(result.length).toBe(1)
    })
  })

  describe("when highlight ends after max alloted end time", () => {
    const ANOTHER_FULL_CALENDAR = new EventBuilder().addEvent(9, 8).events
    it("should return an empty array", () => {
      const results = calendar.findTimeSlot(
        ANOTHER_FULL_CALENDAR,
        oneHourFifteenMinutes,
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
        const results = calendar.findTimeSlot(events, oneHourFifteenMinutes, END_TIME_MAX)
        expect(results.length).toBe(0)
      }
    )
  })

  describe("when there are no events", () => {
    it("should return a list of free time slots from the current time", () => {
      const now = moment()

      const endTime = now.add(1, "hours").add(2, "minutes")
      const time = { hour: 0, minutes: 15 }

      const freeSlots = calendar.findTimeSlot([], time, endTime)

      expect(freeSlots.length).toBe(4)
    })
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
