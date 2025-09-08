import {
  render,
  fireEvent,
  act,
  userEvent,
} from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { InputField } from "@/src/components/inputField";
import { defaultColors } from "@/src/themes/colors";

const user = userEvent.setup();

jest.useFakeTimers();

const mockOnChangeText = jest.fn();
const mockOnFocus = jest.fn();
const mockOnBlur = jest.fn();
const mockValidator = jest.fn((val: string) =>
  val.trim() === "error" ? "Required" : undefined
);

describe("InputField - label rendering", () => {
  it("renders with label and required mark", () => {
    const { getByText } = render(
      <InputField label="Username" required value={""} />
    );
    expect(getByText(/Username/)).toBeTruthy();
    expect(getByText("*")).toBeTruthy();
  });

  it("does not render label when empty", () => {
    const { queryByText } = render(<InputField value={""} />);
    expect(queryByText("*")).toBeNull();
  });

  it("renders with labelStyle", () => {
    const { queryByText } = render(
      <InputField label="Username" value={""} labelStyle={{ color: "red" }} />
    );
    const label = queryByText("Username");
    expect(label).toHaveStyle({ color: "red" });
  });

  it("renders with labelIcon", () => {
    const { getByText } = render(
      <InputField label="Username" labelIcon={"user"} value={""} />
    );
    expect(getByText("user")).toBeTruthy();
  });
});

describe("InputField - basic input behavior", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  it("renders placeholder and accepts text input", () => {
    const { getByPlaceholderText } = render(
      <InputField
        placeholder="Enter name"
        onChangeText={mockOnChangeText}
        value=""
      />
    );
    expect(getByPlaceholderText("Enter name")).toBeTruthy();
  });

  it("renders with editable", async () => {
    const { getByDisplayValue } = render(
      <InputField
        editable={false}
        value="init"
        onChangeText={mockOnChangeText}
        onFocus={mockOnFocus}
      />
    );
    const input = getByDisplayValue("init");
    expect(input.props.editable).toBe(false);
    await fireEvent(input, "focus");
    expect(mockOnFocus).not.toHaveBeenCalled();
  });

  it("renders with errorText", () => {
    const { getByText } = render(
      <InputField value="" errorText="Some error" />
    );
    const error = getByText("Some error");
    expect(error).toBeTruthy();
    expect(error).toHaveStyle({ color: defaultColors.error });
  });

  it("renders with onFocus", async () => {
    const { getByDisplayValue } = render(
      <InputField value="init" onFocus={mockOnFocus} />
    );
    const input = getByDisplayValue("init");

    await user.type(input, "focus");
    expect(mockOnFocus).toHaveBeenCalled();
  });

  it("calls onFocus and clears error", async () => {
    const { getByDisplayValue, getByText, queryByText } = render(
      <InputField
        value="init"
        onFocus={mockOnFocus}
        errorText="Required"
        validator={mockValidator}
      />
    );

    const input = getByDisplayValue("init");
    const error = getByText("Required");
    expect(error).toBeTruthy();
    expect(error).toHaveStyle({ color: defaultColors.error });

    await act(() => {
      fireEvent(input, "focus");
    });
    expect(mockOnFocus).toHaveBeenCalled();
    const errorAfter = queryByText("Required");
    expect(errorAfter).not.toBeTruthy();
  });

  it("renders with onBlur", async () => {
    const { getByDisplayValue } = render(
      <InputField value="init" onBlur={mockOnBlur} />
    );
    const input = getByDisplayValue("init");

    await user.type(input, "blur");
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("calls onBlur and validates", async () => {
    const { getByDisplayValue, getByText } = render(
      <InputField value="error" onBlur={mockOnBlur} validator={mockValidator} />
    );
    const input = getByDisplayValue("error");

    await act(() => {
      fireEvent(input, "focus");
    });
    await act(() => {
      fireEvent(input, "blur");
    });

    expect(mockOnBlur).toHaveBeenCalled();
    expect(getByText("Required")).toBeTruthy();
  });

  it("updates value when prop value changes", async () => {
    const { getByDisplayValue } = render(
      <InputField value="init" onChangeText={mockOnChangeText} />
    );
    const input = getByDisplayValue("init");
    fireEvent.changeText(input, "init1");
    jest.advanceTimersByTime(100);
    fireEvent.changeText(input, "init2");
    jest.advanceTimersByTime(2000);
    expect(mockOnChangeText).toHaveBeenCalledWith("init2");
    expect(mockOnChangeText).toHaveBeenCalledTimes(1);
  });
});

describe("InputField - password toggle", () => {
  it("toggles password visibility", async () => {
    const { getByText, getByRole } = render(
      <InputField type="password" value="1234" />
    );

    const pw = getByRole("button");
    expect(pw).toBeTruthy();

    const eye = getByText("eye");
    expect(eye).toBeTruthy();

    await user.press(pw);

    const eyeoff = getByText("eye-off");
    expect(eyeoff).toBeTruthy();
  });
});

describe("InputField - sections", () => {
  const Left = () => <Text>Left</Text>;
  const Right = () => <Text>Right</Text>;

  it("renders with LeftSection and RightSection", () => {
    const { getByText } = render(
      <InputField LeftSection={Left} RightSection={Right} value="init" />
    );
    expect(getByText("Left")).toBeTruthy();
    expect(getByText("Right")).toBeTruthy();
  });

  it("renders only LeftSection", () => {
    const { getByText, queryByText } = render(
      <InputField LeftSection={Left} value="init" />
    );
    expect(getByText("Left")).toBeTruthy();
    expect(queryByText("Right")).toBeNull();
  });
});

describe("InputField - multiline behavior", () => {
  it("adjusts height when multiline content grows", () => {
    const { getByDisplayValue } = render(<InputField multiline value="init" />);

    const input = getByDisplayValue("init");
    expect(input).toHaveStyle({ height: undefined });

    act(() => {
      fireEvent(input, "contentSizeChange", {
        nativeEvent: { contentSize: { height: 80 } },
      });
    });

    expect(input).toHaveStyle({ height: 80 });
  });
});
