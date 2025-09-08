import {
  render,
  act,
  fireEvent,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

import CreateAccount from "@/app/screens/login/createAccount";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import * as dbdelete from "@/src/database/delete";

const user = userEvent.setup();

const mockGobackScreen = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockGobackScreen,
  }),
}));

const originalLog = console.log;
console.log = jest.fn();

afterAll(() => {
  console.log = originalLog;
});

describe("renders create account screen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("renders create account screen", async () => {
    const { getByPlaceholderText, queryByText, getAllByRole, getByTestId } =
      render(<CreateAccount />);

    const logo = getByTestId("imgAppLogo");
    const inputEmail = getByPlaceholderText("enterEmail");
    const inputUserName = getByPlaceholderText("enterUsername");
    const inputPassword = getByPlaceholderText("enterPassword");
    const inputSecurityCode = getByPlaceholderText("enterSecurityCode");
    const warning = queryByText("warning");
    const btns = getAllByRole("button"); // 4 btns

    expect(logo).toBeTruthy(); // check logo renders
    expect(inputUserName).toBeTruthy(); // check input name renders
    expect(inputUserName).toHaveStyle({
      borderWidth: 1,
      borderBottomWidth: undefined,
    });
    expect(inputEmail).toBeTruthy(); // check input email renders
    expect(inputEmail).toHaveStyle({
      borderWidth: 1,
      borderBottomWidth: undefined,
    });
    expect(inputPassword).toBeTruthy(); // check input password renders
    expect(inputPassword).toHaveStyle({
      borderWidth: 1,
      borderBottomWidth: undefined,
    });
    expect(inputSecurityCode).toBeTruthy(); // check input security code renders
    expect(inputSecurityCode).toHaveStyle({
      borderWidth: 1,
      borderBottomWidth: undefined,
    });
    expect(warning).toBeNull();

    expect(btns[2]).toHaveStyle({
      marginTop: sizes.margin.xxl * 2,
      backgroundColor: defaultColors.primary,
    });
    expect(btns[3]).toHaveStyle({
      marginTop: sizes.margin.xxl * 2,
      backgroundColor: defaultColors.background,
    });
  });

  test("check validate email", async () => {
    const { getByPlaceholderText, getByText } = render(<CreateAccount />);
    const inputEmail = getByPlaceholderText("enterEmail");
    await act(async () => {
      fireEvent.changeText(inputEmail, "abc");
      fireEvent(inputEmail, "blur");
    });
    const warning = getByText("emailValidate");
    expect(warning).toBeTruthy();
  });

  test("check validate username", async () => {
    const { getByPlaceholderText, getByText } = render(<CreateAccount />);
    const inputUserName = getByPlaceholderText("enterUsername");
    await act(async () => {
      fireEvent.changeText(inputUserName, "abc");
      fireEvent(inputUserName, "blur");
    });
    const warning = getByText("userName4Charater");
    expect(warning).toBeTruthy();
  });

  test("check validate password", async () => {
    const { getByPlaceholderText, getByText } = render(<CreateAccount />);
    const inputPassword = getByPlaceholderText("enterPassword");
    await act(async () => {
      fireEvent.changeText(inputPassword, "abc");
      fireEvent(inputPassword, "blur");
    });
    const warning = getByText("password6Charater");
    expect(warning).toBeTruthy();
  });

  test("check validate security code", async () => {
    const { getByPlaceholderText, getByText } = render(<CreateAccount />);
    const inputSecurityCode = getByPlaceholderText("enterSecurityCode");
    await act(async () => {
      fireEvent.changeText(inputSecurityCode, "abc");
      fireEvent(inputSecurityCode, "blur");
    });
    const warning = getByText("securityCode1Charater");
    expect(warning).toBeTruthy();
  });

  test("go back login screen", async () => {
    const { getAllByRole } = render(<CreateAccount />);
    const btns = getAllByRole("button");

    await act(() => {
      user.press(btns[3]); // press Login btn
    });

    await act(() => {
      jest.runAllTimers();
    });

    expect(mockGobackScreen).toHaveBeenCalledTimes(1);
  });

  test("Create Success", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(false); // check email exit

    const { getByPlaceholderText, getAllByRole } = render(
      <CreateAccount />
    );
    const inputEmail = getByPlaceholderText("enterEmail");
    const inputUserName = getByPlaceholderText("enterUsername");
    const inputPassword = getByPlaceholderText("enterPassword");
    const inputSecurityCode = getByPlaceholderText("enterSecurityCode");
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(inputEmail, "kn@gmail.com");
      fireEvent.changeText(inputUserName, "username");
      fireEvent.changeText(inputPassword, "password");
      fireEvent.changeText(inputSecurityCode, "14");
    });

    await act(() => {
      user.press(btns[2]); // press Create btn
    });

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(mockGobackScreen).toHaveBeenCalledTimes(1);
    });
  });

  test("Create dataIsWrong ", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(true); // check email exit)

    const { getByPlaceholderText, getAllByRole } = render(
      <CreateAccount />
    );
    const inputEmail = getByPlaceholderText("enterEmail");
    const inputUserName = getByPlaceholderText("enterUsername");
    const inputPassword = getByPlaceholderText("enterPassword");
    const inputSecurityCode = getByPlaceholderText("enterSecurityCode");
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(inputEmail, "kgmail.com");
      fireEvent.changeText(inputUserName, "username");
      fireEvent.changeText(inputPassword, "password");
      fireEvent.changeText(inputSecurityCode, "14");
    });

    await act(() => {
      user.press(btns[2]); // press Create btn
    });

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("dataIsWrong");
    });
  });

  test("create fail with emailUsed", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(true);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(true); // check email exit
    const { getByPlaceholderText, getAllByRole } = render(<CreateAccount />);
    const inputEmail = getByPlaceholderText("enterEmail");
    const inputUserName = getByPlaceholderText("enterUsername");
    const inputPassword = getByPlaceholderText("enterPassword");
    const inputSecurityCode = getByPlaceholderText("enterSecurityCode");
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(inputEmail, "kn@gmail.com");
      fireEvent.changeText(inputUserName, "username");
      fireEvent.changeText(inputPassword, "password");
      fireEvent.changeText(inputSecurityCode, "14");
    });

    await act(() => {
      user.press(btns[2]); // press Create btn
    });

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("emailUsed");
    });
  });

  test("createAccount reset data failed", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(true);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(false); // check email exit
    jest.spyOn(dbdelete, "resetDatabase").mockRejectedValueOnce(false);

    const { getByPlaceholderText, getAllByRole } = render(<CreateAccount />);
    const inputEmail = getByPlaceholderText("enterEmail");
    const inputUserName = getByPlaceholderText("enterUsername");
    const inputPassword = getByPlaceholderText("enterPassword");
    const inputSecurityCode = getByPlaceholderText("enterSecurityCode");
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(inputEmail, "kn@gmail.com");
      fireEvent.changeText(inputUserName, "username");
      fireEvent.changeText(inputPassword, "password");
      fireEvent.changeText(inputSecurityCode, "14");
    });

    await act(() => {
      user.press(btns[2]); // press Create btn
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(Alert.alert).toHaveBeenCalledWith("cannotSaveData");
  });

  test("create throw error", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(true);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(false); // check email exit
    (SecureStore.setItemAsync as jest.Mock).mockRejectedValueOnce(
      new Error("lỗi")
    );
    jest.spyOn(dbdelete, "resetDatabase").mockRejectedValueOnce(false);

    const { getByPlaceholderText, getAllByRole } = render(<CreateAccount />);
    const inputEmail = getByPlaceholderText("enterEmail");
    const inputUserName = getByPlaceholderText("enterUsername");
    const inputPassword = getByPlaceholderText("enterPassword");
    const inputSecurityCode = getByPlaceholderText("enterSecurityCode");
    const btns = getAllByRole("button");

    await act(() => {
      fireEvent.changeText(inputEmail, "kn@gmail.com");
      fireEvent.changeText(inputUserName, "username");
      fireEvent.changeText(inputPassword, "password");
      fireEvent.changeText(inputSecurityCode, "14");
    });

    await act(() => {
      user.press(btns[2]); // press Create btn
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(Alert.alert).toHaveBeenCalledWith("cannotSaveData");

    console.log = originalLog;
  });
});
