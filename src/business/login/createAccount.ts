import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { defaultBackground } from "@/src/themes/default_background";
import { defaultAvatar } from "@/src/themes/default_avatar";

import { userType, userInfoType } from "@/src/utils/types";

import { resetDatabase } from "../../database/delete";

export const checkHaveEmail = (): Promise<boolean | string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await SecureStore.getItemAsync("isHaveAccount");
      resolve(!!result ? true : false);
    } catch (error) {
      console.log("[checkHaveEmail][Business] ------", error);
      reject(false);
    }
  });
};

export const checkValidateEmail = (email: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const nameEmail = email.split("@")[0];
      const result = await SecureStore.getItemAsync(nameEmail);
      resolve(!!result ? true : false);
    } catch (error) {
      console.log("[checkValidateEmail][Business] ------", error);
      reject(false);
    }
  });
};

export const createAccount = (
  email: string,
  username: string,
  password: string,
  securityCode: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const account: userType = { email, username, password };
      const nameEmail = email.split("@")[0];
      await SecureStore.setItemAsync(
        nameEmail,
        nameEmail[0].toLocaleUpperCase()
      );
      await SecureStore.setItemAsync(
        `loginByAccount${nameEmail}`,
        JSON.stringify(account)
      );

      // create user info
      const userInfo: userInfoType = {
        email,
        username,
        password,
        avatar: "",
        coverBackground: "",
        phone: "",
        birthday: "",
        pushNotification: true,
        shake: true,
      };

      await AsyncStorage.setItem("coverBackground", defaultBackground);
      await AsyncStorage.setItem("avatar", defaultAvatar);

      await SecureStore.setItemAsync(
        `userInfo${nameEmail}`,
        JSON.stringify(userInfo)
      );

      await SecureStore.setItemAsync("securityCode", securityCode);

      // // clear old database
      const result = await resetDatabase();
      if (result === true) {
        await AsyncStorage.setItem("isHaveAccount", "true");
        await AsyncStorage.setItem("isCreatedAccount", username);
        await SecureStore.setItemAsync("email", nameEmail);
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log("[checkValidateEmail][Business] ------", error);
      reject(false);
    }
  });
};
