"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Locale = "en" | "es" | "fr" | "de" | "zh" | "ja" | "ar" | "pt" | "hi" | "ru";

export const locales: Locale[] = ["en", "es", "fr", "de", "zh", "ja", "ar", "pt", "hi", "ru"];

const defaultLocale: Locale = "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, unknown>>({});
  const [mounted, setMounted] = useState(false);

  const loadMessages = async (loc: string) => {
    try {
      const res = await fetch(`/messages/${loc}.json`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        const fallback = await fetch("/messages/en.json");
        if (fallback.ok) setMessages(await fallback.json());
      }
    } catch {
      const fallback = await fetch("/messages/en.json");
      if (fallback.ok) setMessages(await fallback.json());
    }
  };

  useEffect(() => {
    loadMessages("en");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (locale === "en" && Object.keys(messages).length > 0) return;
    loadMessages(locale);
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    if (typeof window === "undefined") return;
    setLocaleState(newLocale);
    document.documentElement.setAttribute("lang", newLocale);
    document.documentElement.setAttribute("dir", newLocale === "ar" ? "rtl" : "ltr");
  };

  const t = (key: string): string => {
    if (!messages || Object.keys(messages).length === 0) return key;
    const keys = key.split(".");
    let value: unknown = messages;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
  }, [locale, mounted]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (key: string) => key,
    };
  }
  return context;
}
