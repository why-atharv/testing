import type { Metadata } from "next";
import { ReadingExperience } from "@/components/reading/ReadingExperience";

export const metadata: Metadata = {
  title: "Your Reading — MysticPalm",
  description: "Capture, upload, or explore an illustrated palm and discover the four major palm lines.",
};

export default function ReadingPage() {
  return <ReadingExperience />;
}
