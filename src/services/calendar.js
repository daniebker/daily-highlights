import moment from "moment"

export const findTimeSlot = (calendarItems, timeSpan, endTimeMax) => {
  console.log("findTimeSlot -> timeSpan", timeSpan)
  const freeSlots = calendarItems.reduce((results, item, index) => {
    const highlightEndTime = moment(item.end.dateTime)
      .add(timeSpan.hour, "hours")
      .add(timeSpan.minutes, "minutes")

    if (
      thereIsNotAnEventAftetThis(calendarItems, index) &&
      highlightEndsBeforeEndTimeMax(highlightEndTime, endTimeMax)
    ) {
      results.push({
        start: moment(item.end.dateTime),
        end: moment(item.end.dateTime)
          .add(timeSpan.hour, "hours")
          .add(timeSpan.minutes, "minutes"),
      })
    }
    return results
  }, [])

  return freeSlots
}

const thereIsNotAnEventAftetThis = (calendarItems, index) => {
  return !calendarItems[index + 1]
}

const highlightEndsBeforeEndTimeMax = (highlightEndTime, endTimeMax) => {
  return moment(highlightEndTime).isBefore(endTimeMax)
}
