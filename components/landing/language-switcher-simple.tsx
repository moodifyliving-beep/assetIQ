"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage, type Locale, locales } from "@/context/language-context";
import { Globe } from "lucide-react";

const languageNames: Record<Locale, string> = {
  en: "English", es: "Español", fr: "Français", de: "Deutsch", zh: "中文", ja: "日本語", ar: "العربية", pt: "Português", hi: "हिन्दी", ru: "Русский",
};

const languageFlags: Record<Locale, string> = {
  en: "🇺🇸", es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", zh: "🇨🇳", ja: "🇯🇵", ar: "🇸🇦", pt: "🇵🇹", hi: "🇮🇳", ru: "🇷🇺",
};

export default function LanguageSwitcherSimple() {
  const { locale, setLocale } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{languageFlags[locale]} {languageNames[locale]}</span>
          <span className="sm:hidden">{languageFlags[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((loc) => (
          <DropdownMenuItem key={`lang-${loc}`} onClick={() => setLocale(loc)} className={`cursor-pointer ${locale === loc ? "bg-accent" : ""}`}>
            <span className="mr-2">{languageFlags[loc]}</span>
            <span>{languageNames[loc]}</span>
            {locale === loc && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
