"use client";

import React, { createContext, useContext, useState } from "react";

// Define the possible recurrence options as a type.
// RecurrenceType can be one of: "none", "daily", "weekly", "monthly", "yearly", or "custom".
export type RecurrenceType =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

// Define the days of the week as a type.
export type WeekDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

// Interface for custom recurrence options.
// This allows setting custom recurrence rules, including frequency, unit (day, week, month, or year),
// specific days of the week (for weekly recurrences), a specific day of the month,
// or an nth occurrence of a weekday within a month.
export interface CustomRecurrence {
  frequency: number; // The frequency of recurrence.
  unit: "day" | "week" | "month" | "year"; // The unit of time for the recurrence.
  weekDays?: WeekDay[]; // Optional: Array of weekdays for weekly recurrence.
  monthDay?: number; // Optional: Specific day of the month for monthly recurrence.
  nthDay?: { day: WeekDay; occurrence: number }; // Optional: Nth occurrence of a weekday in a month.
}

// Interface for the context that will be shared across the app.
// It includes the currently selected date, the type of recurrence,
// the custom recurrence settings, and setters for each of these.
interface DatePickerContextType {
  selectedDate: Date | null; // The currently selected date.
  endDate: Date | null; // The currently endDate date.
  recurrenceType: RecurrenceType; // The current type of recurrence.
  customRecurrence: CustomRecurrence; // The custom recurrence settings.
  setSelectedDate: (date: Date | null) => void; // Function to set the selected date.
  setEndDate: (date: Date | null) => void; // Function to set the end date.
  setRecurrenceType: (type: RecurrenceType) => void; // Function to set the recurrence type.
  setCustomRecurrence: (recurrence: CustomRecurrence) => void; // Function to set custom recurrence settings.
}

// Create a context for the date picker with an undefined initial value.
// This will be used to provide and consume date picker state throughout the app.
const DatePickerContext = createContext<DatePickerContextType | undefined>(
  undefined
);

// This component wraps the part of the app that needs access to the date picker state.
// It provides the current date, recurrence type, and custom recurrence settings to its children.
export default function DatePickerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // State for the selected date, initialized to the current date.
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // State for the type of recurrence, initialized to "none" (no recurrence).
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");

  // State for custom recurrence settings, with default values.
  const [customRecurrence, setCustomRecurrence] = useState<CustomRecurrence>({
    frequency: 1, // Default frequency of 1.
    unit: "day", // Default unit is "day".
    monthDay: 1,
  });

  return (
    // Provide the current date, recurrence type, custom recurrence settings,
    // and their respective setters to all children components.
    <DatePickerContext.Provider
      value={{
        selectedDate,
        endDate,
        recurrenceType,
        customRecurrence,
        setSelectedDate,
        setEndDate,
        setRecurrenceType,
        setCustomRecurrence,
      }}
    >
      {children}
    </DatePickerContext.Provider>
  );
}

// Custom hook to access the DatePicker context.
// This allows any component within the DatePickerProvider to access the date picker state.
export const useDatePicker = () => {
  const context = useContext(DatePickerContext);

  // Throw an error if the hook is used outside of a DatePickerProvider.
  if (context === undefined) {
    throw new Error("useDatePicker must be used within a DatePickerProvider");
  }
  return context;
};
