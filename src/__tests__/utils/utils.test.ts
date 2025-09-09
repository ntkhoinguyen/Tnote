import * as FileSystem from "expo-file-system";


import { defaultColors } from "@/src/themes/colors";
import { getButtonStyles, ensureAttachmentsDir } from "@/src/utils/utils";

jest.mock("expo-file-system", () => ({
  documentDirectory: "mockDir/",
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  EncodingType: { Base64: "base64" },
}));

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

describe("Test ensureAttachmentsDir function", () => {
  test("creates directory if not exists", async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValueOnce({ exists: false }); // dir

    // for avatar & bg exit
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });
    
    await ensureAttachmentsDir();
  
    expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith("mockDir/attachments/", { intermediates: true });
  });

  test("writes coverBackground.png if not exists", async () => {
    // dir exists
    (FileSystem.getInfoAsync as jest.Mock)
      .mockResolvedValueOnce({ exists: true }) // dir
      .mockResolvedValueOnce({ exists: false }) // coverBackground
      .mockResolvedValueOnce({ exists: true }) // avatar
      .mockResolvedValueOnce({ exists: false }) // coverBackground
  
    await ensureAttachmentsDir();
  
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      "mockDir/attachments/coverBackground.png",
      expect.any(String),
      { encoding: "base64" }
    );
  });

  test("writes avatar.png if not exists", async () => {
    // dir exists
    (FileSystem.getInfoAsync as jest.Mock)
      .mockResolvedValueOnce({ exists: true }) // dir
      .mockResolvedValueOnce({ exists: true }) // coverBackground
      .mockResolvedValueOnce({ exists: false }) // avatar
      .mockResolvedValueOnce({ exists: false }) // coverBackground
  
    await ensureAttachmentsDir();
  
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      "mockDir/attachments/avatar.png",
      expect.any(String),
      { encoding: "base64" }
    );
  })
});
