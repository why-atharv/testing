import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { MotionPreferenceProvider } from "@/components/ui/MotionPreference";

export const metadata: Metadata = {
  title: "MysticPalm — Your Hands. Your Story. Your Mystery.",
  description:
    "Explore the art of palmistry through an immersive journey of discovery, interactive hand illustrations, traditional palm-line interpretations, and personal reflection.",
};

export const viewport: Viewport = {
  themeColor: "#06040d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink"
        >
          Skip to content
        </a>
        <MotionPreferenceProvider>{children}</MotionPreferenceProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
