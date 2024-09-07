"use client";

import React from "react";
import { motion } from "framer-motion";
import RecurrenceOptions from "./RecurrenceOptions";
import DateDisplay from "./DateDisplay";
import Calendar from "./Calendar";

// Animation variants for the main container
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DatePicker() {
  return (
    <motion.main
      layout
      className="w-full px-10 py-5 rounded-lg lg:grid lg:grid-cols-[6.5fr,3.5fr] lg:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className="">
        <DateDisplay />
      </section>
      <article className="hidden flex-1 flex-col gap-3 lg:flex">
        <p className="text-white">Mini Calender</p>
        <Calendar mode="view" />
      </article>
      <section className="col-span-2">
        <RecurrenceOptions />
      </section>
      <article className="mt-10 flex flex-col gap-3 lg:hidden">
        <p className="text-white">Mini Calender</p>
        <Calendar mode="view" />
      </article>
    </motion.main>
  );
}
