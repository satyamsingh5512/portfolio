"use client";

import Gear from "@/components/svgs/Gear";
import { motion } from "motion/react";

export default function MaintenancePage() {
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

          {/* Information Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
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
                We&apos;ll be back online soon. Thank you for your patience!
              </p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
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
            transition={{ delay: 0.6 }}
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
