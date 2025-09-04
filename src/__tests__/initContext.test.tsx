import {
  act,
  cleanup,
  renderHook,
  waitFor,
} from "@testing-library/react-native";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme, ThemeProvider } from "@/src/useHook/useTheme";
import { useTranslate, TranslateProvider } from "@/src/useHook/useTranslate";
import { useUser, UserProvider } from "@/src/useHook/userContext";

beforeAll(() => {
  jest.useFakeTimers();
});

describe("useTheme hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("init data with mode=light in AsyncStorage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("light");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      expect(result.current.mode).toBe("light");
      expect(result.current.colors).toBeDefined();
      expect(result.current.setMode).toBeDefined();
    });
  });

  test("init data with mode=dark in AsyncStorage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      expect(result.current.mode).toBe("dark");
    });
  });

  test("init data with no mode in AsyncStorage (fallback)", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (useColorScheme as jest.Mock).mockReturnValue("dark"); // giả định hệ thống dark

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      // fallback systemScheme => giả định mặc định là light
      expect(result.current.mode).toBe("dark");
    });
  });

  test("setMode changes mode and stores in AsyncStorage", () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("light");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    waitFor(() => {
      expect(result.current.mode).toBe("light");
    });

    act(() => {
      result.current.setMode("dark");
    });

    expect(result.current.mode).toBe("dark");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("mode", "dark");
  });
});

describe("useTranslate hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("init data with locale=en in AsyncStorage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("en");

    const { result } = renderHook(() => useTranslate(), {
      wrapper: TranslateProvider,
    });

    await waitFor(() => {
      expect(result.current.locale).toBe("en");
      expect(result.current.t).toBeDefined();
      expect(result.current.setLocale).toBeDefined();
    });
  });

  test("init data with locale=vi in AsyncStorage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("vi");

    const { result } = renderHook(() => useTranslate(), {
      wrapper: TranslateProvider,
    });

    await waitFor(() => {
      expect(result.current.locale).toBe("vi");
    });
  });

  test("init data with no locale in AsyncStorage (fallback)", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useTranslate(), {
      wrapper: TranslateProvider,
    });

    await waitFor(() => {
      expect(result.current.locale).toBe("vi");
    });
  });

  test("change locale translate", () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("vi");

    const { result } = renderHook(() => useTranslate(), {
      wrapper: TranslateProvider,
    });

    waitFor(() => {
      expect(result.current.locale).toBe("vi");
    });

    act(() => {
      result.current.setLocale("en");
    });

    expect(result.current.locale).toBe("en");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("locale", "en");
  });
});

describe("userContext Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const userDefault = {
    avatar: "",
    birthday: "",
    coverBackground: "",
    email: "",
    password: "",
    phone: "",
    pushNotification: true,
    shake: true,
    username: "",
  };

  test("get user default ", () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    expect(result.current.user).toEqual(userDefault);
  });

  test("change user", () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    expect(result.current.user).toEqual(userDefault);

    const newUser = {
      avatar: "avatar_url",
      birthday: "1990-01-01",
      coverBackground: "cover_url",
      email: "email",
      password: "password",
      phone: "phone",
      pushNotification: true,
      shake: true,
      username: "username",
    };

    act(() => {
      result.current.setUser(newUser);
    });

    expect(result.current.user).toEqual(newUser);
  });
});
