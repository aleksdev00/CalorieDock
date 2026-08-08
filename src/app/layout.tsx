import type { Metadata } from "next";

import { QueryProvider } from "@/components/providers/QueryProvider";

import "./globals.css";

const themeBootstrap = `(()=>{try{const t=localStorage.getItem('caloriedock-theme')||'system';const d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch{}})()`;

export const metadata: Metadata = {
  title: "CalorieDock",
  description: "Nutrition tracking and long-term health progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
