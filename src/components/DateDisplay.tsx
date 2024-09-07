"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDatePicker } from "../context/DatePickerContext";
import Calendar from "./Calendar"; // Assuming Calendar is in the same directory
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

// Animation variants for the date display container
const dateDisplayVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DateDisplay() {
  const { selectedDate, endDate } = useDatePicker();
  return (
    <motion.div
      className="w-full flex flex-col gap-5 relative"
      variants={dateDisplayVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <motion.p className="text-base text-white mb-3 font-medium">
          Reminder date
        </motion.p>
        <button className="bg-dark-gradient w-full font-bold flex items-center rounded-xl p-4 text-sm text-[#94A3B8] border border-[rgba(255,255,255,0.15)]">
          {!selectedDate && !endDate
            ? "Select Range"
            : selectedDate && endDate
            ? `${format(selectedDate, "d MMM, yyyy")} - ${format(
                endDate,
                "d MMM, yyyy"
              )}`
            : selectedDate
            ? `${format(selectedDate, "d MMM, yyyy")} -`
            : `- ${format(endDate, "d MMM, yyyy")}`}

          <CalendarDays color="#3B82F6" className="ml-auto w-4 h-4" />
        </button>
      </div>
      <Calendar mode="edit" />
    </motion.div>
  );
}
