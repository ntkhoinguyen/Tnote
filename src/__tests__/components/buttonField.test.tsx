import { render, userEvent } from "@testing-library/react-native";
import { Text } from "react-native";

import { ButtonField } from "@/src/components/buttonField";
import { defaultColors } from "@/src/themes/colors";

const mockOnPress = jest.fn();
const user = userEvent.setup();

describe("ButtonField Component with type", () => {
  test("Renders ButtonField type fill", () => {
    const { queryByRole } = render(<ButtonField type={"fill"} />);
    const button = queryByRole("button");
    const text = queryByRole("text");
    expect(text).toBeNull();
    expect(button).toBeTruthy();
    expect(button).toHaveStyle({
      backgroundColor: defaultColors.primary,
      borderColor: defaultColors.primary,
    });
  });

  test("Renders ButtonField with type outline", () => {
    const { queryByRole } = render(<ButtonField type={"outline"} />);
    const button = queryByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: defaultColors.background,
      borderColor: defaultColors.primary,
    });
  });

  test("Renders ButtonField with type text", () => {
    const { queryByRole } = render(<ButtonField type={"text"} />);
    const button = queryByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: defaultColors.background,
      borderColor: "transparent",
    });
  });
});

describe("ButtonField Component with type and color", () => {
  test("Renders ButtonField with type outline and color red", () => {
    const { queryByRole } = render(
      <ButtonField type={"outline"} color={"red"} />
    );
    const button = queryByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: defaultColors.background,
      borderColor: "red",
    });
  });

  test("Renders ButtonField with type text and color red", () => {
    const { queryByRole } = render(<ButtonField type={"text"} color={"red"} />);
    const button = queryByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: defaultColors.background,
      borderColor: "transparent",
    });
  });
});

describe("ButtonField Component with text", () => {
  test("Renders ButtonField with text and type fill with no color", () => {
    const { queryByRole } = render(
      <ButtonField type={"fill"} text={"Hello"} />
    );
    const button = queryByRole("button");
    const text = queryByRole("text");
    expect(button).toBeTruthy();
    expect(text).toBeTruthy();
    expect(text).toHaveTextContent("Hello");
    expect(text).toHaveStyle({ color: defaultColors.white });
    expect(button).toHaveStyle({
      backgroundColor: defaultColors.primary,
      borderColor: defaultColors.primary,
    });
  });

  test("Renders ButtonField with text and type fill with color green", () => {
    const { queryByRole } = render(
      <ButtonField type={"fill"} text={"Hello"} color={"green"} />
    );
    const button = queryByRole("button");
    const text = queryByRole("text");
    expect(button).toBeTruthy();
    expect(text).toBeTruthy();
    expect(text).toHaveTextContent("Hello");
    expect(text).toHaveStyle({ color: defaultColors.white });
    expect(button).toHaveStyle({
      backgroundColor: "green",
      borderColor: "green",
    });
  });

  test("Renders ButtonField with text and type outline with no color", () => {
    const { queryByRole } = render(
      <ButtonField type={"outline"} text={"Hello"} />
    );
    const button = queryByRole("button");
    const text = queryByRole("text");
    expect(button).toBeTruthy();
    expect(text).toBeTruthy();
    expect(text).toHaveTextContent("Hello");
    expect(text).toHaveStyle({ color: defaultColors.primary });
    expect(button).toHaveStyle({
      backgroundColor: defaultColors.background,
      borderColor: defaultColors.primary,
    });
  });

  test("Renders ButtonField with text and type outline with color green", () => {
    const { queryByRole } = render(
      <ButtonField type={"outline"} text={"Hello"} color={"green"} />
    );
    const button = queryByRole("button");
    const text = queryByRole("text");
    expect(button).toBeTruthy();
    expect(text).toBeTruthy();
    expect(text).toHaveTextContent("Hello");
    expect(text).toHaveStyle({ color: "green" });
    expect(button).toHaveStyle({
      backgroundColor: defaultColors.background,
      borderColor: "green",
    });
  });

  test("Renders ButtonField with text and type text with no color", () => {
    const { queryByRole } = render(
      <ButtonField type={"text"} text={"Hello"} />
    );
    const button = queryByRole("button");
    const text = queryByRole("text");
    expect(button).toBeTruthy();
    expect(text).toBeTruthy();
    expect(text).toHaveTextContent("Hello");
    expect(text).toHaveStyle({ color: defaultColors.primary });
    expect(button).toHaveStyle({
      backgroundColor: defaultColors.background,
      borderColor: "transparent",
    });
  });

  test("Renders ButtonField with text and type text with color green", () => {
    const { queryByRole } = render(
      <ButtonField type={"text"} text={"Hello"} color={"green"} />
    );
    const button = queryByRole("button");
    const text = queryByRole("text");
    expect(button).toBeTruthy();
    expect(text).toBeTruthy();
    expect(text).toHaveTextContent("Hello");
    expect(text).toHaveStyle({ color: "green" });
    expect(button).toHaveStyle({
      backgroundColor: defaultColors.background,
      borderColor: "transparent",
    });
  });
});

describe("ButtonField Component with onPress", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("Renders ButtonField with onPress", async () => {
    const { queryByRole } = render(
      <ButtonField
        type={"fill"}
        text={"Press me"}
        color="pink"
        onPress={mockOnPress}
      />
    );
    const button = queryByRole("button");
    expect(button).toBeTruthy();
    // First press
    await user.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    // Call onPress again immediately
    await user.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1); // Should still be 1 due to debounce

    // // Fast-forward time by 2 seconds
    jest.advanceTimersByTime(2000);

    // Call onPress again after debounce period
    await user.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(2); // Should be 2 now
  });

  test("Renders ButtonField with onPress and disabled", async () => {
    const { queryByRole } = render(
      <ButtonField
        type={"fill"}
        text={"Press me"}
        color="pink"
        onPress={mockOnPress}
        disabled
      />
    );
    const button = queryByRole("button");
    expect(button).toBeTruthy();
    // First press
    await user.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(0);
    // Call onPress again immediately
    await user.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(0); // Should still be 0 due to disabled

    // // Fast-forward time by 2 seconds
    jest.advanceTimersByTime(2000);

    // Call onPress again after debounce period
    await user.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(0); // Should be 0 still
  });
});

describe("ButtonField Component with LeftSection and RightSection", () => {
  const LeftSection = () => <Text>Left</Text>;
  const RightSection = () => <Text>Right</Text>;

  test("Renders ButtonField with LeftSection and RightSection", () => {
    const { queryByRole, getByText } = render(
      <ButtonField
        type={"fill"}
        text={"Center"}
        color="purple"
        LeftSection={LeftSection}
        RightSection={RightSection}
      />
    );
    const button = queryByRole("button");
    const left = getByText("Left");
    const right = getByText("Right");
    const center = getByText("Center");

    expect(button).toBeTruthy();
    expect(left).toBeTruthy();
    expect(right).toBeTruthy();
    expect(center).toBeTruthy();
  });

  test("Renders ButtonField with only LeftSection", () => {
    const { queryByRole, getByText, queryByText } = render(
      <ButtonField
        type={"fill"}
        text={"Center"}
        color="purple"
        LeftSection={LeftSection}
      />
    );
    const button = queryByRole("button");
    const left = getByText("Left");
    const right = queryByText("Right");
    const center = getByText("Center");

    expect(button).toBeTruthy();
    expect(left).toBeTruthy();
    expect(right).toBeNull();
    expect(center).toBeTruthy();
  });
});

describe("ButtonField Component with containerStyle", () => {
  test("Renders ButtonField with containerStyle", () => {
    const { queryByRole } = render(
      <ButtonField
        type={"fill"}
        text={"Styled Button"}
        color="orange"
        containerStyle={{ marginTop: 20, borderRadius: 10 }}
      />
    );
    const button = queryByRole("button");
    expect(button).toBeTruthy();
    expect(button).toHaveStyle({ marginTop: 20, borderRadius: 10 });
  });
});
