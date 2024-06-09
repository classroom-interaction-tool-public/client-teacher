import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import CITAppShell from "../components/CITAppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CIT - Teacher Dashboard",
  description: "The Classroom Interaction Tool for teachers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>

      <body className={inter.className}>
        <MantineProvider>
          <CITAppShell>{children}</CITAppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
