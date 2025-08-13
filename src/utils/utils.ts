import { Alert, Dimensions } from "react-native";
import * as FileSystem from "expo-file-system";
import { Router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import moment from "moment";

import { colors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { defaultAvatar } from "@/src/themes/default_avatar";
import { defaultBackground } from "@/src/themes/default_background";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const CryptoJS = require("crypto-js");

export const priorityGroup = [
  { id: 1, title: "Gấp" },
  { id: 2, title: "Cao" },
  { id: 3, title: "Bình thường" },
  { id: 4, title: "Thấp" },
  { id: 5, title: "Không ưu tiên" },
];

export const colorByPriority = {
  1: colors.red,
  2: colors.orange,
  3: colors.green,
  4: colors.teal,
  5: colors.white,
};

export const screenReload = {
  groupDetail: "groupDetail",
  tagDetail: "tagDetail",
  tagScreen: "tagScreen",
  notiScreen: "notiScreen",
  homeScreen: "homeScreen",
  taskDetail: "taskDetail",
};

export const screenReloadTask = {
  notification: "notification",
  calendar: "calendar",
  kanban: "kanban",
};

const getSecurityKey = async (): Promise<{
  key: null;
  iv: null;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const securityKey = await SecureStore.getItemAsync("securityCode");
      if (securityKey === null) {
        return resolve({ key: null, iv: null });
      }
      const rawKey = (securityKey + "0000000000000000").slice(0, 16);
      const key = CryptoJS.enc.Utf8.parse(rawKey);
      const iv = CryptoJS.enc.Utf8.parse(rawKey);
      resolve({ key: key, iv: iv });
    } catch (error) {
      console.error("Error getting security key:", error);
      reject(null);
    }
  });
};

export const encryptedData = async (data: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { key, iv } = await getSecurityKey();
      if (key === null || iv === null) {
        return resolve(data);
      }
      const encrypted = CryptoJS.AES.encrypt(data, key, { iv }).toString();
      resolve(encrypted);
    } catch (error) {
      console.error("Error encrypting data:", error);
      reject(data);
    }
  });
};

export const decryptedData = async (encryptedData: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { key, iv } = await getSecurityKey();
      if (key === null || iv === null) {
        return resolve(encryptedData);
      }
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv,
      }).toString(CryptoJS.enc.Utf8);
      resolve(decrypted);
    } catch (error) {
      console.error("Error decrypting data:", error);
      reject(encryptedData);
    }
  });
};

export const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const { width } = Dimensions.get("window");

export const kanbanItemWidth =
  width <= 330 ? width - sizes.padding.lg * 2 : 300;

export const kanbanColumnWidth = kanbanItemWidth + 24;

export const calendarHeaderHeight = 40;

export const calendarNameDaysHeight = 40;

// TODO: transation
export const DAYS = ["Hai", "Ba", "Tu", "Nam", "Sau", "Bay", "CN"];

export const dayMinHeight = 50;
export const monthHalfScreenMinHeight = dayMinHeight * 5;
export const eventMaxHeight = 25;
export const textNumberDayHeight = sizes.padding.lg;

export const showAlertDataNotExit = (
  router: Router,
  t: (key: string) => string
) => {
  return Alert.alert(t("notification"), t("dataNotExit"), [
    {
      text: t("ok"),
      onPress: () => {
        router.back();
      },
    },
  ]);
};

export const showAlertNotFoundData = (t: (key: string) => string) => {
  return Alert.alert(t("notification"), t("dataNotExit"));
};

export const showAlertDeleteNotSuccess = (t: (key: string) => string) => {
  return Alert.alert(t("notification"), t("deleteNotSuccess"));
};

export const showAlertSaveNotSuccess = (t: (key: string) => string) => {
  return Alert.alert(t("notification"), t("saveNotSuccess"));
};

const ATTACHMENTS_DIR = FileSystem.documentDirectory + "attachments/";
export const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "heic",
  "svg",
];

export const ensureAttachmentsDir = async () => {
  const dirInfo = await FileSystem.getInfoAsync(ATTACHMENTS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(ATTACHMENTS_DIR, {
      intermediates: true,
    });
  }
  const coverBackground = await isAttachmentExists("coverBackground.png");
  const avatar = await isAttachmentExists("avatar.png");
  if (!coverBackground) {
    const coverBackground = defaultBackground;
    const exit = await isAttachmentExists("coverBackground.png");
    if (!exit && coverBackground) {
      await FileSystem.writeAsStringAsync(
        ATTACHMENTS_DIR + "coverBackground.png",
        coverBackground,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );
    }
  }

  if (!avatar) {
    const avatar = defaultAvatar;
    const exit = await isAttachmentExists("avatar.png");
    if (!exit && avatar) {
      await FileSystem.writeAsStringAsync(
        ATTACHMENTS_DIR + "avatar.png",
        avatar,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );
    }
  }
};

export const getAttachmentUri = (filename: string) => {
  return FileSystem.documentDirectory + "attachments/" + filename;
};

export const isAttachmentExists = async (
  filename: string
): Promise<boolean> => {
  const fileUri = ATTACHMENTS_DIR + filename;
  const info = await FileSystem.getInfoAsync(fileUri);
  return info.exists;
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const movePhotoToAttachments = async (
  sourceUri: string,
  remove: boolean = false
): Promise<string> => {
  await ensureAttachmentsDir(); // đảm bảo thư mục tồn tại
  const fileType = sourceUri.split(".").pop();
  const filenameCustom =
    moment().format("DD_MM_YYYY_HH_mm_ssss_SSSS") + "." + fileType;

  console.log("kiem tra filenameCustom", filenameCustom);

  const destinationUri = ATTACHMENTS_DIR + filenameCustom;

  const exists = await isAttachmentExists(filenameCustom);
  if (exists) {
    return destinationUri;
  }
  if (remove) {
    await FileSystem.moveAsync({
      from: sourceUri,
      to: destinationUri,
    });
  } else {
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });
  }
  return destinationUri;
};

export const deleteAttachments = async (uris: string[]): Promise<void> => {
  for (const uri of uris) {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    } catch (error) {
      console.warn(`Failed to delete file at ${uri}:`, error);
    }
  }
};
