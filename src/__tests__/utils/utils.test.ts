import { defaultColors } from "@/src/themes/colors";
import { getButtonStyles } from "@/src/utils/utils";

describe("Test getButtonStyles function", () => {
  test("getButtonStyles function exists", () => {
    expect(typeof getButtonStyles).toBe("function");
  });

  test("getButtonStyles returns correct styles for 'outline' type", () => {
    const styles = getButtonStyles("outline", "blue", defaultColors);
    expect(styles).toEqual({
      backgroundColor: defaultColors.background,
      textColor: "blue",
      borderColor: "blue",
    });
  });

  test("getButtonStyles returns correct styles for 'text' type", () => {
    const styles = getButtonStyles("text", "red", defaultColors);
    expect(styles).toEqual({
      backgroundColor: defaultColors.background,
      textColor: "red",
      borderColor: "transparent",
    });
  });

  test("getButtonStyles returns correct styles for 'fill' type", () => {
    const styles = getButtonStyles("fill", "yellow", defaultColors);
    expect(styles).toEqual({
      backgroundColor: "yellow",
      textColor: defaultColors.white,
      borderColor: "yellow",
    });
  });

  test("getButtonStyles returns correct styles for unknown type", () => {
    const styles = getButtonStyles("unknown", "green", defaultColors);
    expect(styles).toEqual({
      backgroundColor: defaultColors.background,
      textColor: "green",
      borderColor: defaultColors.background,
    });
  });

  test("getButtonStyles handles empty color", () => {
    const styles = getButtonStyles("fill", "", defaultColors);
    expect(styles).toEqual({
      backgroundColor: "",
      textColor: defaultColors.white,
      borderColor: "",
    });
  });

  test("getButtonStyles handles empty type and empty color", () => {
    const styles = getButtonStyles("", "", defaultColors);
    expect(styles).toEqual({
      backgroundColor: defaultColors.background,
      textColor: defaultColors.primary,
      borderColor: defaultColors.background,
    });
  });
});
