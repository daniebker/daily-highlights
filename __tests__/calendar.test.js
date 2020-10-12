const { findTimeSlot } = require("../src/services/calendar")

describe("given a timespan", () => {
  const timeSpan = { hour: 1, minutes: 15 }

  describe("when there are no free time slots", () => {
    const calandarItems = [
      {
        start: {
          dateTime: "2020-09-16T09:00:00+02:00",
          timeZone: "Europe/Madrid",
        },
        end: {
          dateTime: "2020-10-12T18:00:00+02:00",
          timeZone: "Europe/Madrid",
        },
      },
    ]

    it("should return an empty array", () => {
      const results = findTimeSlot(calandarItems, timeSpan)
      expect(results.length).toBe(0)
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
