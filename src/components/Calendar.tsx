"use client";

import { useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  add,
  parse,
  startOfToday,
} from "date-fns";

import { useDatePicker } from "../context/DatePickerContext";

import { isDayRecurring, isDaySelected } from "@/utils";
import toast from "react-hot-toast";

interface CalendarProps {
  mode: "edit" | "view"; // "edit" for selecting dates, "view" for displaying with recurrence highlights
}

const Calendar: React.FC<CalendarProps> = ({ mode }) => {
  const {
    selectedDate,
    endDate,
    customRecurrence,
    recurrenceType,
    setSelectedDate,
    setEndDate,
    setRecurrenceType,
    setCustomRecurrence,
  } = useDatePicker();

  const today = selectedDate ? selectedDate : startOfToday();

  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [move, setMove] = useState(0);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    setMove(-1);
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    setMove(1);
  }

  function handleDayClick(day: Date) {
    if (mode === "view") return;

    if (endDate) {
      if (day >= endDate) {
        toast.error("Selected date should come before end date");
        return;
      }
    }

    const areDaysEqual = isEqual(selectedDate || "", day);
    console.log("areDaysEqual, click", areDaysEqual);

    if (!areDaysEqual) {
      setSelectedDate(day);
      return;
    }

    if (areDaysEqual) {
      setSelectedDate(null);
    }
  }

  function handleEndDayClick(day: Date) {
    if (mode === "view") return;

    if (selectedDate) {
      if (day <= selectedDate) {
        toast.error("End date should come after selected date");
        return;
      }
    }

    const areDaysEqual = isEqual(endDate || "", day);
    console.log("areDaysEqual, dbclick", areDaysEqual);

    if (!areDaysEqual) {
      setEndDate(day);
      return;
    }

    if (areDaysEqual) {
      setEndDate(null);
    }
  }

  const handleClick = (day: Date) => {
    if (clickTimeout) {
      // If a timeout already exists, it means this is a double-click
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleEndDayClick(day);
    } else {
      // If no timeout exists, it's the first click of a potential double-click
      const timeout = setTimeout(() => {
        handleDayClick(day);
        setClickTimeout(null);
      }, 100); // Delay (in ms) - adjust as needed

      setClickTimeout(timeout);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        className="w-full rounded-3xl flex flex-col gap-2.5 p-6 text-white bg-dark-gradient"
      >
        <motion.div
          layout="position"
          className="flex items-center overflow-hidden"
        >
          <button
            type="button"
            onClick={previousMonth}
            className="flex flex-none items-center justify-center p-1.5"
          >
            <ChevronLeft />
          </button>
          <motion.p
            key={currentMonth}
            initial={{ opacity: 0, x: move * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -move * 50 }}
            className="text-center text-sm font-medium flex-1"
          >
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </motion.p>

          <button
            onClick={nextMonth}
            type="button"
            className=" ml-1 flex flex-none items-center justify-center p-1.5 hover:bg-l-f-overlay1 t-all"
          >
            <ChevronRight />
          </button>
        </motion.div>
        <motion.div layout className="bg-[rgba(19,25,39,51)] rounded-2xl p-4">
          <motion.div
            layout
            className="grid grid-cols-7 text-sm text-center text-[#94A3B8] font-medium mb-3"
          >
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </motion.div>
          <motion.div layout className="grid grid-cols-7 text-sm">
            {days.map((day, dayIdx) => (
              <motion.div
                layout="position"
                initial={{ opacity: 0, x: move * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -move * 50 }}
                key={day.toString()}
                className={clsx(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  mode === "view" && "cursor-not-allowed",
                  "p-1"
                )}
              >
                <button
                  type="button"
                  onClick={() => handleClick(day)}
                  className={clsx(
                    mode === "edit" && "hover:border-2 hover:border-[#BDFCFE]",
                    mode === "edit" &&
                      isDaySelected(day, selectedDate) &&
                      "bg-[#6462fbe6]  text-[#BDFCFE]",
                    mode === "edit" &&
                      isDaySelected(day, endDate) &&
                      "bg-[#ed5d5de6]  text-[#BDFCFE]",
                    mode === "view" &&
                      isDayRecurring(
                        day,
                        selectedDate,
                        endDate,
                        recurrenceType,
                        customRecurrence
                      ) &&
                      "bg-green-500 text-white",
                    mode === "view" && "cursor-not-allowed",
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-center"
                  )}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export default Calendar;
