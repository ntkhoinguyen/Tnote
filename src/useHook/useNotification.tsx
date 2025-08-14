import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { Alert, Linking, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string
) {
  if (!expoPushToken) {
    Alert.alert("No token found");
    return;
  }

  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: { someData: "goes here" },
    android: {
      icon: "./assets/images/logo.png",
      color: "#FF231F7C", // Màu nền thông báo
    },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function promptForNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "denied") {
    Alert.alert(
      "Thông báo bị tắt",
      "Bạn đã tắt thông báo cho ứng dụng này. Vui lòng vào Cài đặt để bật lại quyền thông báo.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Mở Cài đặt",
          onPress: () => Linking.openSettings(),
        },
      ]
    );
    return false;
  }

  const { status: newStatus } = await Notifications.requestPermissionsAsync();
  return newStatus === "granted";
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null; // Trả về null nếu quyền bị từ chối
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      const deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
      return { pushTokenString, deviceToken };
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

const NotificationContext = createContext({
  hasPermission: false,
  sendNotification: (title: string, body: string) => {},
  setMounted: (mounted: boolean) => {},
});

export const NotificationProvider = ({ children }: any) => {
  const router = useRouter();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [deviceToken, setDeviceToken] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [lastNoti, setLastNoti] = useState<any>(null);
  const [isMount, setMounted] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(
        (token) => (
          setExpoPushToken(token?.pushTokenString ?? ""),
          setDeviceToken(token?.deviceToken ?? ""),
          setHasPermission(true)
        )
      )
      .catch((error: any) => setHasPermission(false));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {}
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const content = response?.notification?.request?.content ?? null;
        if (content && content.data && content.data.taskId) {
          setLastNoti(content.data);
        }
      });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      const content = response?.notification?.request?.content ?? null;
      if (content && content.data && content.data.taskId) {
        setLastNoti(content.data);
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isMount) {
      if (lastNoti && lastNoti.taskId) {
        router.push(
          `/screens/details/task?id=${lastNoti.taskId}&from=calendar`
        );
        setLastNoti(null);
      }
    }
  }, [lastNoti, isMount]);

  const value = useMemo(
    () => ({
      sendNotification: async (title: string, body: string) => {
        if (hasPermission && expoPushToken) {
          await sendPushNotification(expoPushToken, title, body);
        } else {
          const granted = await promptForNotificationPermission();
          if (granted) {
            const token = await registerForPushNotificationsAsync();
            if (token) {
              setExpoPushToken(token.pushTokenString);
              setDeviceToken(token.deviceToken);
              setHasPermission(true);
              await sendPushNotification(token.pushTokenString, title, body);
            }
          }
        }
      },
      setMounted: (mounted: boolean) => setMounted(mounted),
      hasPermission,
    }),
    [expoPushToken, hasPermission]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
export default NotificationContext;
