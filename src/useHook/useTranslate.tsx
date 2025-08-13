import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n } from "@/src/i18n/i18n";

type TranslateContextType = {
  t: (key: string) => string;
  locale: string;
  setLocale: (locale: "en" | "vi") => void;
};
export const TranslateContext = createContext<TranslateContextType>({
  locale: "vn",
  t: (key: string) => key,
  setLocale: (locale: "en" | "vi") => {},
});

export const TranslateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<"en" | "vi">("vi");
  const [update, setUpdate] = useState(0);

  const init = async () => {
    const locale = await AsyncStorage.getItem("locale");
    if (locale === "en" || locale === "vi") {
      setLocaleState(locale);
    } else {
      setLocaleState("vi");
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    i18n.locale = locale;
    setUpdate(update + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const setLocale = (locale: "en" | "vi") => {
    setLocaleState(locale);
    AsyncStorage.setItem("locale", locale);
  };

  return (
    <TranslateContext.Provider
      value={{ t: i18n.t.bind(i18n), locale, setLocale }}
    >
      {children}
    </TranslateContext.Provider>
  );
};

// 4. Hook sử dụng
export const useTranslate = () => {
  const context = useContext(TranslateContext);
  if (!context) {
    throw new Error("useTranslate must be used within a TranslateProvider");
  }
  return context;
};
