import {
  act,
  fireEvent,
  render,
  userEvent,
} from "@testing-library/react-native";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

import LoginScreen from "@/app/screens/login/login";
import { defaultColors } from "@/src/themes/colors";

const user = userEvent.setup();

const mockGotoLoadingScreen = jest.fn();
const mockPushScreen = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockGotoLoadingScreen,
    push: mockPushScreen,
  }),
  useFocusEffect: (cb: any) => cb(),
}));

beforeAll(() => {
  jest.useFakeTimers();
});

describe("render login screen init", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("render login screen has all children components", async () => {
    const { getByTestId, getByText, getByPlaceholderText, getAllByRole } =
      render(<LoginScreen />);
    const logo = getByTestId("imgAppLogo");
    const appName = getByText("My App");
    const inputUsername = getByPlaceholderText("enterUsername");
    const inputPassword = getByPlaceholderText("enterPassword");
    const btnCreateAccount = getByText("createAccount");
    const btnForgetPassword = getByText("forgetPassword");
    // btns 4: btnEye, btnCreate, btnForget, btnLogin
    const btns = getAllByRole("button");
    const appVersion = getByText("1.0.0");

    expect(logo).toBeTruthy(); // check logo renders
    expect(appName).toBeTruthy();
    expect(appName).toHaveStyle({ color: defaultColors.green });
    expect(inputUsername).toBeTruthy(); // check input username renders
    expect(inputUsername).toHaveStyle({
      borderWidth: 1,
      borderBottomWidth: undefined,
    });
    expect(inputPassword).toBeTruthy(); // check input password renders
    expect(inputPassword).toHaveStyle({
      borderWidth: 1,
      borderBottomWidth: undefined,
    });
    expect(btnCreateAccount).toBeTruthy(); // check button create account renders
    expect(btnCreateAccount).toHaveStyle({
      color: defaultColors.primary,
    });
    expect(btnForgetPassword).toBeTruthy(); // check button forget password renders
    expect(btnForgetPassword).toHaveStyle({
      color: defaultColors.teal,
    });
    expect(btns[3]).toBeTruthy(); // check button login renders
    expect(btns[3]).toHaveStyle({
      backgroundColor: defaultColors.primary,
    });
    expect(appVersion).toBeTruthy(); // check app version renders
  });

  test("render login screen with check database success", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("email");
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
      JSON.stringify({
        username: "username_login",
        password: "password_login",
      })
    );
    const { getByPlaceholderText, getAllByRole } = render(<LoginScreen />);

    act(() => {
      jest.runAllTimers();
    });

    const inputUsername = getByPlaceholderText("enterUsername");
    const inputPassword = getByPlaceholderText("enterPassword");
    // btns 4: btnEye, btnCreate, btnForget, btnLogin
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(inputUsername, "username_login");
      fireEvent.changeText(inputPassword, "password_login");
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await act(() => {
      user.press(btns[3]); // press Login btn
    });

    await act(() => {
      jest.runAllTimers();
    });

    expect(mockGotoLoadingScreen).toHaveBeenCalledWith(
      "/screens/login/loading"
    );
  });

  test("render login screen with check database false", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("email");
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
      JSON.stringify({
        username: "username_login_false",
        password: "password_login",
      })
    );
    const { getByPlaceholderText, getAllByRole, getByText } = render(
      <LoginScreen />
    );

    act(() => {
      jest.runAllTimers();
    });

    const inputUsername = getByPlaceholderText("enterUsername");
    const inputPassword = getByPlaceholderText("enterPassword");
    // btns 4: btnEye, btnCreate, btnForget, btnLogin
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(inputUsername, "username_login");
      fireEvent.changeText(inputPassword, "password_login");
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await act(() => {
      user.press(btns[3]); // press Login btn
    });

    await act(() => {
      jest.runAllTimers();
    });

    expect(getByText("wrongAccount")).toBeTruthy();
  });

  test("render login screen with check database throw error", async () => {
    const originalLog = console.log;
    console.log = jest.fn(); // 👈 chặn log
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(
      new Error("Failed to open database")
    );
    const { getByPlaceholderText, getAllByRole } = render(<LoginScreen />);

    act(() => {
      jest.runAllTimers();
    });

    const inputUsername = getByPlaceholderText("enterUsername");
    const inputPassword = getByPlaceholderText("enterPassword");
    // btns 4: btnEye, btnCreate, btnForget, btnLogin
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(inputUsername, "username_login");
      fireEvent.changeText(inputPassword, "password_login");
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await act(() => {
      user.press(btns[3]); // press Login btn
    });

    await act(() => {
      jest.runAllTimers();
    });

    expect(Alert.alert).toHaveBeenCalledWith("errorCannotGetData");

    console.log = originalLog; // 👈 khôi phục log
  });

  test("render login screen with go to new account", async () => {
    const { getAllByRole } = render(<LoginScreen />);

    act(() => {
      jest.runAllTimers();
    });

    // btns 4: btnEye, btnCreate, btnForget, btnLogin
    const btns = getAllByRole("button");

    await act(() => {
      user.press(btns[1]); // press Login btn
    });

    await act(() => {
      jest.runAllTimers();
    });

    expect(mockPushScreen).toHaveBeenCalledWith("/screens/login/createAccount");
  });

  test("render login screen with go to forget password", async () => {
    const { getAllByRole } = render(<LoginScreen />);

    act(() => {
      jest.runAllTimers();
    });

    // btns 4: btnEye, btnCreate, btnForget, btnLogin
    const btns = getAllByRole("button");

    await act(() => {
      user.press(btns[2]); // press Login btn
    });

    await act(() => {
      jest.runAllTimers();
    });

    expect(mockPushScreen).toHaveBeenCalledWith(
      "/screens/login/forgetPassword"
    );
  });
});
