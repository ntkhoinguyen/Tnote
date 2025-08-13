// ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors, defaultColors } from "@/src/themes/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeModeType = "light" | "dark";
type ThemeContextType = {
  colors: typeof defaultColors;
  mode: ThemeModeType;
  setMode: (mode: ThemeModeType) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultColors,
  mode: "light",
  setMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeApp] = useState<ThemeModeType>("light");

  const init = async () => {
    const mode = await AsyncStorage.getItem("mode");
    if (mode === "light" || mode === "dark") {
      setModeApp(mode);
    } else {
      setModeApp(systemScheme === "dark" ? "dark" : "light");
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemScheme]);

  const setMode = (mode: ThemeModeType) => {
    setModeApp(mode);
    AsyncStorage.setItem("mode", mode);
  };

  const colors = useMemo(() => {
    return mode === "dark" ? darkColors : lightColors;
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ colors, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
