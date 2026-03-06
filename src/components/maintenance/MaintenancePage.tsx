"use client";

import Gear from "@/components/svgs/Gear";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

// Update this to your estimated maintenance completion time
const ESTIMATED_COMPLETION = new Date("2026-03-03T12:00:00Z");
// Fixed start time for progress calculation (e.g., when you enabled maintenance)
const START_TIME = new Date("2026-03-02T08:00:00Z");

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = ESTIMATED_COMPLETION.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });

        // Calculate progress percentage
        const total = ESTIMATED_COMPLETION.getTime() - START_TIME.getTime();
        const elapsed = now.getTime() - START_TIME.getTime();
        const percentage = Math.min(Math.max((elapsed / total) * 100, 0), 99);
        setProgress(percentage);
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Animated Gear Icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="mb-8 inline-block"
          >
            <div className="h-24 w-24 text-blue-600 dark:text-blue-400">
              <Gear />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white"
          >
            Under Maintenance
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 text-lg text-gray-600 md:text-xl dark:text-gray-400"
          >
            We&apos;re currently performing scheduled maintenance to improve
            your experience.
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
          >
            <div className="h-4 px-4 text-xs font-medium text-white">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex h-full items-center justify-end rounded-full bg-blue-600 dark:bg-blue-500"
              >
                <span className="pr-1">{Math.round(progress)}%</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12 flex justify-center gap-4 text-center md:gap-8"
          >
            {[
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="flex flex-col">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white text-2xl font-bold text-gray-900 shadow-md md:h-20 md:w-20 md:text-3xl dark:bg-gray-800 dark:text-white">
                  {String(item.value).padStart(2, "0")}
                </div>
                <span className="mt-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Information Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 grid gap-4 md:grid-cols-2"
          >
            <div className="rounded-lg bg-white p-6 text-left shadow-lg dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What&apos;s happening?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We&apos;re upgrading our systems to provide you with better
                performance and new features.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 text-left shadow-lg dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                When will we be back?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Estimated completion:{" "}
                {ESTIMATED_COMPLETION.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600 dark:text-gray-400"
          >
            <p className="mb-4">Need immediate assistance?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:contact@satyamsharma.tech"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Support
              </a>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-sm text-gray-500 dark:text-gray-500"
          >
            <p>Thank you for your patience!</p>
            <p className="mt-2">
              © {new Date().getFullYear()} Satyam Singh. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
