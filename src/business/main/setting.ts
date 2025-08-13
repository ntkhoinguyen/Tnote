import { userInfoType, userType } from "@/src/utils/types";
import { movePhotoToAttachments } from "@/src/utils/utils";
import * as SecureStore from "expo-secure-store";

export const saveSetting = async (
  user: userInfoType
): Promise<userInfoType | false> => {
  return new Promise(async (resolve, reject) => {
    try {
      const email = user.email;
      const nameEmail = email.split("@")[0];
      let newUser = { ...user };
      await SecureStore.setItemAsync(
        `userInfo${nameEmail}`,
        JSON.stringify(newUser)
      );
      resolve(user);
    } catch (error) {
      console.log("[saveSetting][Business][ERROR] -----:", error);
      reject(false);
    }
  });
};

export const saveSettingImage = async (
  user: userInfoType,
  imageType: "avatar" | "coverBackground",
  isMove: boolean
): Promise<userInfoType | false> => {
  return new Promise(async (resolve, reject) => {
    try {
      const uri = await movePhotoToAttachments(user[imageType], isMove);
      user[imageType] = uri;
      await saveSetting(user);
      resolve(user);
    } catch (error) {
      console.log("[saveSetting][Business][ERROR] -----:", error);
      reject(false);
    }
  });
};

export const saveSettingInfoLogin = async (
  user: userInfoType
): Promise<userInfoType | false> => {
  return new Promise(async (resolve, reject) => {
    try {
      const email = user.email;
      const nameEmail = email.split("@")[0];
      let newUser = { ...user };
      newUser.coverBackground = "";
      newUser.avatar = "";

      const account: userType = {
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
      };
      // Save user info
      await SecureStore.setItemAsync(
        `userInfo${nameEmail}`,
        JSON.stringify(newUser)
      );
      // Save account info
      await SecureStore.setItemAsync(
        `loginByAccount${nameEmail}`,
        JSON.stringify(account)
      );
      resolve(user);
    } catch (error) {
      console.log("[saveSettingInfoLogin][Business][ERROR] -----:", error);
      reject(false);
    }
  });
};
