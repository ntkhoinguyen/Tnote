import { act, render } from "@testing-library/react-native";

import { LoadingIcon } from "@/src/components/loadingIcon";
import { defaultColors } from "@/src/themes/colors";

describe("LoadingIcon Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("render init default", () => {
    const { getByTestId, getAllByTestId } = render(
      <LoadingIcon size={"large"} />
    );

    const container = getByTestId("loadingContainer");
    const loadingSpinner = getByTestId("loadingSpinner");
    const bars = getAllByTestId(/^loadingBar/);
    const loadingLogo = getByTestId("loadingLogo");

    expect(container).toBeTruthy();
    expect(loadingSpinner).toBeTruthy();
    expect(bars.length).toBe(13);
    expect(loadingLogo).toBeTruthy();
    expect(loadingLogo.props.source).toBe(require("@/assets/images/logo.png"));
  });

  test("render init small", () => {
    const { getByTestId, getAllByTestId } = render(
      <LoadingIcon size={"small"} />
    );

    const bars = getAllByTestId(/^loadingBar/);
    const logo = getByTestId("loadingLogo");
    expect(bars.length).toBe(13);
    expect(bars[0]).toHaveStyle({
      width: 3,
      height: 7,
      backgroundColor: defaultColors.primary,
    });

    expect(logo).toHaveStyle({
      width: 21,
      height: 21,
    });
  });

  test("render init medium and color pink", () => {
    const { getByTestId, getAllByTestId } = render(
      <LoadingIcon size={"medium"} color={"pink"} />
    );

    const bars = getAllByTestId(/^loadingBar/);
    const logo = getByTestId("loadingLogo");
    expect(bars.length).toBe(13);
    expect(bars[0]).toHaveStyle({
      width: 5,
      height: 17,
      backgroundColor: "pink",
    });

    expect(logo).toHaveStyle({
      width: 35,
      height: 35,
    });
  });

  test("render init large and color red", () => {
    const { getByTestId, getAllByTestId } = render(
      <LoadingIcon size={"large"} color={"red"} />
    );

    const bars = getAllByTestId(/^loadingBar/);
    const logo = getByTestId("loadingLogo");
    expect(bars.length).toBe(13);
    expect(bars[0]).toHaveStyle({
      width: 8,
      height: 20,
      backgroundColor: "red",
    });

    expect(logo).toHaveStyle({
      width: 56,
      height: 56,
    });
  });

  test("check container styles", () => {
    const { getByTestId } = render(
      <LoadingIcon
        size={"large"}
        containerStyle={{ backgroundColor: "yellow" }}
      />
    );
    const container = getByTestId("loadingContainer");
    expect(container).toHaveStyle({
      backgroundColor: "yellow",
    });
  });

  test("Animated test", () => {
    const { getByTestId } = render(<LoadingIcon size={"large"} />);
    const loadingSpinner = getByTestId("loadingSpinner");
    act(() => {
      jest.runAllTimers();
    });
    expect(loadingSpinner).toHaveStyle({
      transform: [{ rotate: "0deg" }],
    });
  });

  test("snapshot test", () => {
    const tree = render(<LoadingIcon size={"medium"} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
