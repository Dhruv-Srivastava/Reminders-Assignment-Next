"use client";

import React from "react";
import { motion } from "framer-motion";
import { RecurrenceType, useDatePicker } from "../context/DatePickerContext";
import Radio from "./Radio";

// Animation variants for the options container
const optionsVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const optionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const RecurrenceOptions: React.FC = () => {
  const {
    recurrenceType,
    setRecurrenceType,
    customRecurrence,
    setCustomRecurrence,
  } = useDatePicker();

  // Handler for updating custom recurrence
  const handleCustomRecurrenceChange = (key: string, value: any) => {
    setCustomRecurrence({ ...customRecurrence, [key]: value });
  };

  return (
    <motion.div
      variants={optionsVariants}
      initial="hidden"
      animate="visible"
      className="text-white"
    >
      <motion.p
        className="text-base font-medium mb-3"
        variants={optionVariants}
      >
        Repeat
      </motion.p>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-wrap gap-3 text-black lg:grid lg:grid-cols-3 lg:border-[rgba(255,255,255,0.3)] lg:border-r-2 lg:pr-4">
          <Radio
            value="none"
            name="recurrenceType"
            onChange={(e: React.SyntheticEvent) =>
              setRecurrenceType(e.target.value as RecurrenceType)
            }
            checked={recurrenceType === "none"}
          />
          <Radio
            value="daily"
            name="recurrenceType"
            onChange={(e: React.SyntheticEvent) =>
              setRecurrenceType(e.target.value as RecurrenceType)
            }
            checked={recurrenceType === "daily"}
          />
          <Radio
            value="weekly"
            name="recurrenceType"
            onChange={(e: React.SyntheticEvent) =>
              setRecurrenceType(e.target.value as RecurrenceType)
            }
            checked={recurrenceType === "weekly"}
          />
          <Radio
            value="monthly"
            name="recurrenceType"
            onChange={(e: React.SyntheticEvent) =>
              setRecurrenceType(e.target.value as RecurrenceType)
            }
            checked={recurrenceType === "monthly"}
          />
          <Radio
            value="yearly"
            name="recurrenceType"
            onChange={(e: React.SyntheticEvent) =>
              setRecurrenceType(e.target.value as RecurrenceType)
            }
            checked={recurrenceType === "yearly"}
          />
          <Radio
            value="custom"
            name="recurrenceType"
            onChange={(e: React.SyntheticEvent) =>
              setRecurrenceType(e.target.value as RecurrenceType)
            }
            checked={recurrenceType === "custom"}
          />
        </div>
        {recurrenceType === "custom" && (
          <motion.div
            className="flex-1 flex flex-col gap-5"
            variants={optionsVariants}
          >
            <motion.div
              className="flex flex-wrap gap-5 items-center"
              variants={optionVariants}
            >
              <label htmlFor="frequency" className="text-base font-medium">
                Every
                <input
                  type="number"
                  min="1"
                  value={customRecurrence.frequency}
                  id="frequency"
                  onChange={(e) =>
                    handleCustomRecurrenceChange(
                      "frequency",
                      parseInt(e.target.value)
                    )
                  }
                  className="p-3 ml-2 w-24 text-base rounded-md bg-dark-gradient border border-[rgba(255,255,255,0.15)]"
                />
              </label>

              <div className="w-fit flex gap-2 text-black">
                <Radio
                  value="day"
                  name="customRecurrenceUnit"
                  checked={customRecurrence.unit === "day"}
                  onChange={(e) => {
                    handleCustomRecurrenceChange("unit", e.target.value);
                  }}
                />
                <Radio
                  value="week"
                  name="customRecurrenceUnit"
                  checked={customRecurrence.unit === "week"}
                  onChange={(e) => {
                    handleCustomRecurrenceChange("unit", e.target.value);
                  }}
                />
                <Radio
                  value="month"
                  name="customRecurrenceUnit"
                  checked={customRecurrence.unit === "month"}
                  onChange={(e) => {
                    handleCustomRecurrenceChange("unit", e.target.value);
                  }}
                />
                <Radio
                  value="year"
                  name="customRecurrenceUnit"
                  checked={customRecurrence.unit === "year"}
                  onChange={(e) => {
                    handleCustomRecurrenceChange("unit", e.target.value);
                  }}
                />
              </div>
            </motion.div>

            {customRecurrence.unit === "week" && (
              <motion.div
                className="flex flex-wrap gap-3"
                variants={optionVariants}
              >
                {[
                  "sunday",
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                ].map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-green-500 w-4 h-4"
                      checked={customRecurrence.weekDays?.includes(day as any)}
                      onChange={(e) => {
                        const weekDays = customRecurrence.weekDays || [];
                        if (e.target.checked) {
                          handleCustomRecurrenceChange("weekDays", [
                            ...weekDays,
                            day,
                          ]);
                        } else {
                          handleCustomRecurrenceChange(
                            "weekDays",
                            weekDays.filter((d) => d !== day)
                          );
                        }
                      }}
                    />
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
                ))}
              </motion.div>
            )}

            {customRecurrence.unit === "month" && (
              <motion.div variants={optionVariants}>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="monthRecurrence"
                    checked={!customRecurrence.nthDay}
                    onChange={() =>
                      handleCustomRecurrenceChange("nthDay", undefined)
                    }
                    className="accent-green-500 w-6 h-6"
                  />
                  On day
                  <input
                    type="number"
                    min="1"
                    max="31"
                    className="p-1 border rounded  text-black"
                    value={customRecurrence.monthDay}
                    onChange={(e) =>
                      handleCustomRecurrenceChange(
                        "monthDay",
                        parseInt(e.target.value)
                      )
                    }
                    disabled={!!customRecurrence.nthDay}
                  />
                </label>
                <label className="flex items-center mt-2">
                  <input
                    type="radio"
                    name="monthRecurrence"
                    checked={!!customRecurrence.nthDay}
                    onChange={() => {
                      handleCustomRecurrenceChange("nthDay", {
                        day: "monday",
                        occurrence: 1,
                      });
                    }}
                    className="mr-2 accent-green-500 w-6 h-6"
                  />
                  On the
                  <select
                    className="ml-2 p-1 border rounded bg-white text-gray-800"
                    value={customRecurrence.nthDay?.occurrence}
                    onChange={(e) =>
                      handleCustomRecurrenceChange("nthDay", {
                        ...customRecurrence.nthDay,
                        occurrence: parseInt(e.target.value),
                      })
                    }
                    disabled={!customRecurrence.nthDay}
                  >
                    <option value={1}>First</option>
                    <option value={2}>Second</option>
                    <option value={3}>Third</option>
                    <option value={4}>Fourth</option>
                  </select>
                  <select
                    className="ml-2 p-1 border rounded bg-white text-gray-800"
                    value={customRecurrence.nthDay?.day}
                    onChange={(e) =>
                      handleCustomRecurrenceChange("nthDay", {
                        ...customRecurrence.nthDay,
                        day: e.target.value,
                      })
                    }
                    disabled={!customRecurrence.nthDay}
                  >
                    {[
                      "sunday",
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                    ].map((day) => (
                      <option key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RecurrenceOptions;
