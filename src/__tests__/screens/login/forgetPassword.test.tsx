import {
  act,
  fireEvent,
  render,
  userEvent,
} from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";

import { defaultColors } from "@/src/themes/colors";
import ForgetPassword from "@/app/screens/login/forgetPassword";

const user = userEvent.setup();

const mockGobackScreen = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockGobackScreen,
  }),
}));

describe("render init layout of ForgetPassword", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("render init layout", () => {
    const { getByPlaceholderText, getAllByRole, getByTestId, queryByText } =
      render(<ForgetPassword />);
    const img = getByTestId("imgAppLogo");
    const email = getByPlaceholderText("enterEmail");
    const code = getByPlaceholderText("enterSecurityCode");
    const error = queryByText("warning");
    const btns = getAllByRole("button");
    expect(img).toBeTruthy();
    expect(email).toBeTruthy();
    expect(email).toHaveStyle({ borderWidth: 1, borderBottomWidth: undefined });
    expect(code).toBeTruthy();
    expect(code).toHaveStyle({ borderWidth: 1, borderBottomWidth: undefined });
    expect(error).toBeNull();
    expect(btns).toBeTruthy();
    expect(btns[1]).toHaveStyle({
      backgroundColor: defaultColors.primary,
      borderColor: defaultColors.primary,
    });
    expect(btns[2]).toHaveStyle({
      backgroundColor: defaultColors.background,
      borderColor: "transparent",
    });
  });

  test("go back login screen", async () => {
    const { getAllByRole } = render(<ForgetPassword />);
    const btns = getAllByRole("button");

    await act(() => {
      user.press(btns[2]); // press Login btn
    });

    await act(() => {
      jest.runAllTimers();
    });

    expect(mockGobackScreen).toHaveBeenCalledTimes(1);
  });
});

describe("Test on get password", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("get PassWord success", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("email");
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("13");
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
      JSON.stringify({
        username: "username_login",
        password: "password_login",
      })
    );

    const { getByPlaceholderText, getAllByRole, queryByText } = render(
      <ForgetPassword />
    );
    const email = getByPlaceholderText("enterEmail");
    const code = getByPlaceholderText("enterSecurityCode");
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(email, "email");
      fireEvent.changeText(code, "13");
    });

    await act(() => {
      user.press(btns[1]);
    });

    await act(() => {
      jest.runAllTimers();
    });

    const error = queryByText("warning");

    expect(error).toBeNull();
  });

  test("get Password fail", async () => {

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("14");
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        username: "username_login",
        password: "password_login",
      })
    );

    const { getByPlaceholderText, getAllByRole, queryByText } = render(
      <ForgetPassword />
    );
    const email = getByPlaceholderText("enterEmail");
    const code = getByPlaceholderText("enterSecurityCode");
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(email, "email");
      fireEvent.changeText(code, "14");
    });

    await act(() => {
      user.press(btns[1]);
    });

    await act(() => {
      jest.runAllTimers();
    });

    const error = queryByText("warning");
    expect(error).toBeTruthy();
  });

  test("get PassWord fail error", async () => {
    const originalLog = console.log;
    console.log = jest.fn(); // 👈 chane log

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("email");
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("14");
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
      new Error("Failed to open database")
    );

    const { getByPlaceholderText, getAllByRole, queryByText } = render(
      <ForgetPassword />
    );
    const email = getByPlaceholderText("enterEmail");
    const code = getByPlaceholderText("enterSecurityCode");
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(email, "email");
      fireEvent.changeText(code, "14");
    });

    await act(() => {
      user.press(btns[1]);
    });

    await act(() => {
      jest.runAllTimers();
    });

    const error = queryByText("warning");
    expect(error).toBeTruthy();

    console.log = originalLog;
  });
});
