import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const checkCreateNewAccount = (): Promise<false | string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const isCreatedAccount = await AsyncStorage.getItem("isCreatedAccount");
      if (isCreatedAccount) {
        await AsyncStorage.setItem("isCreatedAccount", "");
        resolve(isCreatedAccount);
      }
      resolve(false);
    } catch (error) {
      console.log("[checkCreateNewAccount][Business] ------", error);
      reject(false);
    }
  });
};

export const checkLoginByAccount = (
  username: string,
  password: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const nameEmail = await SecureStore.getItemAsync("email");
      const user = await SecureStore.getItemAsync(`loginByAccount${nameEmail}`);
      if (user) {
        const data = JSON.parse(user);
        if (data.username === username && data.password === password) {
          return resolve(true);
        }
        return resolve(false);
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[checkLoginByAccount][Business] ------", error);
      reject(false);
    }
  });
};

// const onLoginGG = async () => {
//   try {
//     await GoogleSignin.configure({
//       webClientId:
//         "969091734428-u5md7nngcg36a0cjidf8ml2mthu5a4uf.apps.googleusercontent.com", // để xác thực OAuth trên server
//       offlineAccess: true,
//     });
//     await GoogleSignin.hasPlayServices();
//     const respones = await GoogleSignin.signIn();
//     if (isSuccessResponse(respones)) {
//       console.log(respones);
//     } else {
//       console.log("Login failed", respones);
//     }
//   } catch (error) {
//     console.log("Login failed statusCode", statusCodes);
//     console.log(error);
//     if (isErrorWithCode(error)) {
//       console.log("Login failed Code", statusCodes);
//     }
//   }
// };
