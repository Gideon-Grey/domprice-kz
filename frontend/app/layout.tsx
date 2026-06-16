import type { Metadata } from "next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.scss";

export const metadata: Metadata = {
  title: "DomPrice - Оценка стоимости квартир",
  description: "ML модель для оценки рыночной стоимости квартир в Казахстане",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}