import { act, render, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

import LoadingScreen from "@/app/screens/login/loading";
import * as createDB from "@/src/database/create";
import { userInfoType } from "@/src/utils/types";
import * as utils from "@/src/utils/utils";

const mockReplace = jest.fn();

jest.mock("expo-router", () => {
  return {
    useRouter: () => ({
      replace: mockReplace,
    }),
  };
});

jest.mock("@/src/database/create", () => ({
  createDatabase: jest.fn(), // <- bắt buộc khai báo ở đây
}));

jest.mock("@/src/utils/utils", () => ({
  ...jest.requireActual("@/src/utils/utils"),
  getAttachmentUri: jest.fn(),
  ensureAttachmentsDir: jest.fn(),
}));

describe("render LoadingScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const userInfo: userInfoType = {
    username: "username_login",
    password: "password_login",
    email: "email",
    avatar: "",
    coverBackground: "",
    phone: "",
    birthday: "",
    pushNotification: true,
    shake: true,
  };

  test("render init layout", () => {
    const { getByTestId } = render(<LoadingScreen />);

    const logo = getByTestId("loadingLogo");
    expect(logo).toBeTruthy();
    expect(logo.props.source).toBe(require("@/assets/images/logo.png"));
    expect(logo).toHaveStyle({
      width: 56,
      height: 56,
    });
  });

  test("check init database Success", async () => {
    (createDB.createDatabase as jest.Mock).mockResolvedValueOnce(true);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("email");
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(userInfo)
    );
    (utils.getAttachmentUri as jest.Mock).mockResolvedValueOnce(
      "mockDir/attachments/coverBackground.png"
    );
    (utils.getAttachmentUri as jest.Mock).mockResolvedValueOnce(
      "mockDir/attachments/avatar.png"
    );

    render(<LoadingScreen />);

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/screens/main/home");
    });
  });

  test("check init database fail", async () => {
    const origin = console.log;
    console.log = jest.fn();

    (createDB.createDatabase as jest.Mock).mockResolvedValueOnce(false);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("email");
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(userInfo)
    );
    (utils.getAttachmentUri as jest.Mock).mockResolvedValueOnce(
      "mockDir/attachments/coverBackground.png"
    );
    (utils.getAttachmentUri as jest.Mock).mockResolvedValueOnce(
      "mockDir/attachments/avatar.png"
    );

    render(<LoadingScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("errorCannotGetData");
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(mockReplace).toHaveBeenCalledWith("/screens/login/login");

    console.log = origin;
  });

  test("check init ensureAttachmentsDir fail", async () => {
    const origin = console.log;
    console.log = jest.fn();

    (createDB.createDatabase as jest.Mock).mockResolvedValueOnce(true);
    (utils.ensureAttachmentsDir as jest.Mock).mockResolvedValueOnce(
      new Error("lỗi")
    );

    render(<LoadingScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("errorCannotGetData");
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(mockReplace).toHaveBeenCalledWith("/screens/login/login");

    console.log = origin;
  });

  test("check get userInfo error fail", async () => {
    const origin = console.log;
    console.log = jest.fn();

    (createDB.createDatabase as jest.Mock).mockResolvedValueOnce(true);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
      new Error("lỗi")
    );

    render(<LoadingScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("errorCannotGetData");
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(mockReplace).toHaveBeenCalledWith("/screens/login/login");

    console.log = origin;
  });

  test.only("check get userInfo wrong format fail", async () => {
    (createDB.createDatabase as jest.Mock).mockResolvedValueOnce(true);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("email");
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(true);

    render(<LoadingScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("errorCannotGetData");
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(mockReplace).toHaveBeenCalledWith("/screens/login/login");
  });
});
