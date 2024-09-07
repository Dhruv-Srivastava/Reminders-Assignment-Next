import {
  CustomRecurrence,
  RecurrenceType,
  WeekDay,
} from "@/context/DatePickerContext";

import {
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isSameDay,
  differenceInDays,
  getDate,
  differenceInCalendarDays,
  differenceInYears,
  differenceInCalendarYears,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
} from "date-fns";

function isEndOfMonth(date: Date): boolean {
  // Get the last day of the month for the given date
  const lastDayOfMonth = endOfMonth(date);

  // Check if the given date is the same as the last day of the month
  return isSameDay(date, lastDayOfMonth);
}

function checkNthOrLastDayOfWeek(date: Date, targetDay: number): number | null {
  const dayOfWeek = getDay(date); // Get the day of the week (0-6)

  if (dayOfWeek !== targetDay) {
    return null; // Not the target day
  }

  const dayOfMonth = getDate(date); // Get the day of the month (1-31)
  const lastDayOfMonth = getDay(endOfMonth(date)); // Get the last day of the month
  const lastDayOfMonthDate = endOfMonth(date);

  // Check for nth occurrence
  const nthOccurrence = Math.ceil(dayOfMonth / 7);

  if (nthOccurrence === 1) return 1;
  if (nthOccurrence === 2) return 2;
  if (nthOccurrence === 3) return 3;
  if (nthOccurrence === 4) return 4;

  return null;
}

export function isDaySelected(day: Date, selectedDate: Date | null) {
  return isEqual(day, selectedDate || "");
}

export function isDayRecurring(
  day: Date,
  selectedDate: Date | null,
  endDate: Date | null,
  recurrenceType: RecurrenceType,
  customRecurrence: CustomRecurrence
): boolean {
  // Handle 'none' recurrence type
  if (!selectedDate) return false;

  if (day < selectedDate) return false;

  if (endDate && day > endDate) return false;

  if (recurrenceType === "none") {
    return false;
  }

  // Handle 'daily' recurrence type
  if (recurrenceType === "daily") {
    return true;
  }

  // Handle 'weekly' recurrence type
  // The weekly criteria should be check the day of the week and check the selected day of the week.
  if (recurrenceType === "weekly") {
    return getDay(day) === getDay(selectedDate);
  }

  // Handle 'monthly' recurrence type
  if (recurrenceType === "monthly") {
    const reminderDate = selectedDate.getDate();

    if (reminderDate === 31) {
      return isEndOfMonth(day);
    } else if (reminderDate === 30 || reminderDate === 29) {
      // Check for Feb
      if (day.getMonth() === 1 && isEndOfMonth(day)) return true;
    }

    return day.getDate() === reminderDate;
  }

  // Handle 'yearly' recurrence type
  if (recurrenceType === "yearly") {
    // If you select the last day of FEB check if currentDay is last day of feb or not
    if (selectedDate.getMonth() === 1 && isEndOfMonth(selectedDate))
      return day.getMonth() === 1 && isEndOfMonth(day);

    return (
      selectedDate.getMonth() === day.getMonth() &&
      selectedDate.getDate() === day.getDate()
    );
  }

  // Handle custom recurrence type
  if (recurrenceType === "custom") {
    const { frequency, unit, weekDays, monthDay, nthDay } = customRecurrence;

    if (unit === "day") {
      const difference = differenceInDays(day, selectedDate);
      return difference % frequency === 0;
    }

    if (unit === "week") {
      const dayOfWeek = format(day, "eeee").toLowerCase() as WeekDay;
      const diffWeeks = differenceInCalendarWeeks(day, selectedDate);
      return (
        (weekDays?.includes(dayOfWeek) ?? false) && diffWeeks % frequency === 0
      );
    }

    if (unit === "month") {
      const diffMonths = differenceInCalendarMonths(day, selectedDate);
      if (monthDay && !nthDay) {
        // Ensure nthDay is not set when checking for monthDay
        return day.getDate() === monthDay && diffMonths % frequency === 0;
      }

      if (nthDay) {
        // Ensure monthDay is not set when checking for nthDay
        const check = checkNthOrLastDayOfWeek(day, getWeekDayIndex(nthDay.day));
        return check === nthDay.occurrence && diffMonths % frequency === 0;
      }
    }

    if (unit === "year") {
      // Check if the month and day match
      if (
        (selectedDate.getMonth() === 1 &&
          isEndOfMonth(selectedDate) &&
          day.getMonth() === 1 &&
          isEndOfMonth(day)) ||
        (selectedDate.getMonth() === day.getMonth() &&
          selectedDate.getDate() === day.getDate())
      ) {
        // Calculate the difference in years between the two dates
        const diffYears = differenceInCalendarYears(day, selectedDate);

        // Check if the difference in years is divisible by the frequency
        return diffYears % frequency === 0;
      }

      return false;
    }

    return false;
  }

  return false;
}

function getWeekDayIndex(day: WeekDay): number {
  const weekDayMap: Record<WeekDay, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  return weekDayMap[day];
}
