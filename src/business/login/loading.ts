import * as SecureStore from "expo-secure-store";
import { userInfoType } from "@/src/utils/types";
import { createDatabase } from "@/src/database/create";
import { getAttachmentUri } from "@/src/utils/utils";

export const getUserInfo = async (): Promise<userInfoType | null | false> => {
  return new Promise(async (resolve, reject) => {
    try {
      const email = await SecureStore.getItemAsync("email");
      const user = await SecureStore.getItemAsync(`userInfo${email}`);
      const coverBackground = getAttachmentUri("coverBackground.png");
      const avatar = getAttachmentUri("avatar.png");
      if (typeof user === "string") {
        const userInfo: userInfoType = JSON.parse(user);
        userInfo.coverBackground =
          userInfo.coverBackground === ""
            ? coverBackground
            : userInfo.coverBackground;
        userInfo.avatar = userInfo.avatar === "" ? avatar : userInfo.avatar;
        resolve(userInfo);
      } else {
        resolve(null);
      }
    } catch (error) {
      console.log("[getUserInfo][Business][ERROR] ------", error);
      reject(false);
    }
  });
};

export const initDatabase = async (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await createDatabase();
      resolve(result);
    } catch (error) {
      console.log("[createDatabase][Business][ERROR] ------", error);
      reject(false);
    }
  });
};
