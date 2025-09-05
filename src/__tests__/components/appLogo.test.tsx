import { render } from "@testing-library/react-native";

import { AppLogo } from "@/src/components/appLogo";
import { sizes } from "@/src/themes/sizes";

describe("Test AppLogo Component", () => {
  it("renders with correct props", () => {
    const { getByTestId } = render(<AppLogo />);

    const logo = getByTestId("imgAppLogo");
    expect(logo.props.resizeMode).toBe("contain");
    expect(logo.props.style).toMatchObject([{
      width: sizes.appLogoWidth,
      height: sizes.appLogoHeight,
    }, { opacity: 1 }]);
  });

  test("snapshot testing for AppLogo", () => {
    const tree = render(<AppLogo />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
