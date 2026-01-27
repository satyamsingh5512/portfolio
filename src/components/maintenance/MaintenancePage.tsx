"use client";

import Gear from "@/components/svgs/Gear";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MaintenancePage() {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);

  // Set your estimated completion time here
  const estimatedCompletion = new Date("2026-01-28T12:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = estimatedCompletion.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ hours, minutes, seconds });

        // Simulate progress (you can replace this with actual progress from your backend)
        const totalTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const elapsed = totalTime - difference;
        const progressPercent = Math.min((elapsed / totalTime) * 100, 95);
        setProgress(progressPercent);
      } else {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [estimatedCompletion]);

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              Progress: {Math.round(progress)}%
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mb-8 grid max-w-md grid-cols-3 gap-4"
          >
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <div className="text-3xl font-bold text-blue-600 md:text-4xl dark:text-blue-400">
                {String(countdown.hours).padStart(2, "0")}
              </div>
              <div className="mt-1 text-xs text-gray-500 md:text-sm dark:text-gray-400">
                Hours
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <div className="text-3xl font-bold text-blue-600 md:text-4xl dark:text-blue-400">
                {String(countdown.minutes).padStart(2, "0")}
              </div>
              <div className="mt-1 text-xs text-gray-500 md:text-sm dark:text-gray-400">
                Minutes
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <div className="text-3xl font-bold text-blue-600 md:text-4xl dark:text-blue-400">
                {String(countdown.seconds).padStart(2, "0")}
              </div>
              <div className="mt-1 text-xs text-gray-500 md:text-sm dark:text-gray-400">
                Seconds
              </div>
            </div>
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
                Expected completion:{" "}
                {estimatedCompletion.toLocaleString("en-US", {
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
              <a
                href="https://twitter.com/satyamsharma"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-white shadow-lg transition-colors duration-200 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter/X
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
              © {new Date().getFullYear()} Satyam Sharma. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
