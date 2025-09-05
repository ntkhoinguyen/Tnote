import { act, render, waitFor } from "@testing-library/react-native";
import * as SQLite from "expo-sqlite";

import SplashCustom from "@/app/screens/login/splashScreen";
import { databaseName } from "@/src/database/setting";

jest.mock("expo-sqlite", () => {
  return {
    openDatabaseAsync: jest.fn(() => Promise.resolve(true)),
  };
});

const mockGotoLogin = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockGotoLogin,
  }),
}));

beforeAll(() => {
  jest.useFakeTimers();
});

describe("Splash Screen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("render splash screen correctly with check database success", async () => {
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(true);
    const { getByTestId, queryByText } = render(<SplashCustom />);
    await act(() => {
      jest.runAllTimers();
    });
    const logo = getByTestId("imgAppLogo");
    expect(logo).toBeTruthy(); // check logo renders
    expect(queryByText("errorStartApp")).toBeNull(); // check error text not renders
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1);
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith(databaseName);

    await waitFor(
      () => {
        expect(mockGotoLogin).toHaveBeenCalledWith("/screens/login/login");
      },
      { timeout: 3000 }
    );
  });

  test("render splash screen correctly with check database false", async () => {
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(false);
    const { getByTestId, getByText } = render(<SplashCustom />);
    await act(() => {
      jest.runAllTimers();
    });
    const logo = getByTestId("imgAppLogo");
    expect(logo).toBeTruthy(); // check logo renders
    expect(getByText("errorStartApp")).toBeTruthy();
  });

  test("render splash screen correctly with check database throw error", async () => {
    const originalLog = console.log;
    console.log = jest.fn(); // 👈 chặn log

    (SQLite.openDatabaseAsync as jest.Mock).mockRejectedValue(
      new Error("Failed to open database")
    );
    const { getByTestId, getByText } = render(<SplashCustom />);
    await act(() => {
      jest.runAllTimers();
    });
    const logo = getByTestId("imgAppLogo");
    expect(logo).toBeTruthy(); // check logo renders
    expect(getByText("errorStartApp")).toBeTruthy();
    console.log = originalLog; // 👈 khôi phục log
  });
});
