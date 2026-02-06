"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ru from "@/locales/ru.json";
import uz from "@/locales/uz.json";

type Locale = "ru" | "uz";
type Translations = typeof ru;

interface LanguageContextType {
    language: Locale;
    setLanguage: (lang: Locale) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Locale>("ru");
    const [t, setT] = useState<Translations>(ru);

    useEffect(() => {
        if (language === "uz") {
            setT(uz);
        } else {
            setT(ru);
        }
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
