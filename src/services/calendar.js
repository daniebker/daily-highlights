import moment from "moment"

export const findTimeSlot = (calendarItems, timeSpan, endTimeMax) => {
  const freeSlots = calendarItems.reduce((results, item, index) => {
    const highlightEndTime = moment(item.end.dateTime)
      .add(timeSpan.hours, "h")
      .add(timeSpan, "m")

    if (
      thereIsNotAnEventAftetThis(calendarItems, index) &&
      highlightEndsBeforeEndTimeMax(highlightEndTime, endTimeMax)
    ) {
      results.push({
        start: moment(item.end.dateTime),
        end: moment(item.end.dateTime)
          .add(timeSpan.hours, "h")
          .add(timeSpan, "m"),
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
