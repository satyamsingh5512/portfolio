import MaintenancePage from "@/components/maintenance/MaintenancePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Maintenance | Satyam Singh",
  description:
    "We are currently performing scheduled maintenance. We will be back shortly.",
  robots: "noindex, nofollow",
};

export default function Maintenance() {
  return <MaintenancePage />;
}
