import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers | Cyberxperts",
  description:
    "Join Cyberxperts' cyber security and IT teams in Sandton, South Africa. Browse open roles across security operations, consulting, and engineering.",
};

export default function Page() {
  return <CareersClient />;
}
