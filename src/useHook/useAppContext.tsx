import { useTheme } from "@/src/useHook/useTheme";
import { useTranslate } from "@/src/useHook/useTranslate";
import { sizes } from "@/src/themes/sizes";
import Constants from "expo-constants";
export const useAppContext = () => {
  const { colors, mode, setMode } = useTheme();
  const { t, locale, setLocale } = useTranslate();
  const appName = Constants.expoConfig?.name ?? "My App";
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  return { colors, mode, setMode, t, locale, setLocale, sizes, appName, appVersion };
};
