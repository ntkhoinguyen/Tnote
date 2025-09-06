/* eslint-disable no-undef */
import { Alert } from "react-native";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

jest.mock("expo-notifications", () => {
  return {
    // mock hàm chính
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
    requestPermissionsAsync: jest.fn(() =>
      Promise.resolve({ status: "granted" })
    ),
    getExpoPushTokenAsync: jest.fn(() =>
      Promise.resolve({ data: "fake-push-token" })
    ),
    scheduleNotificationAsync: jest.fn(() =>
      Promise.resolve({ identifier: "fake-id" })
    ),
    cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
    dismissNotificationAsync: jest.fn(() => Promise.resolve()),
    dismissAllNotificationsAsync: jest.fn(() => Promise.resolve()),

    // listener mock
    addNotificationReceivedListener: jest.fn(),
    addNotificationResponseReceivedListener: jest.fn(),
    removeNotificationSubscription: jest.fn(),

    // event emitter mock
    setNotificationHandler: jest.fn(),
  };
});

jest.mock("expo-secure-store");

jest.spyOn(Alert, "alert");

jest.mock("@expo/vector-icons", () => {
  const View = require("react-native").View;
  const Text = require("react-native").Text;
  return {
    FontAwesome: (props) => (
      <View {...props}>
        <Text>{props.name}</Text>
      </View>
    ),
    FontAwesome5: (props) => (
      <View {...props}>
        <Text>{props.name}</Text>
      </View>
    ),
    Ionicons: (props) => (
      <View {...props}>
        <Text>{props.name}</Text>
      </View>
    ),
    MaterialIcons: (props) => (
      <View {...props}>
        <Text>{props.name}</Text>
      </View>
    ),
    MaterialCommunityIcons: (props) => (
      <View {...props}>
        <Text>{props.name}</Text>
      </View>
    ),
    Entypo: (props) => (
      <View {...props}>
        <Text>{props.name}</Text>
      </View>
    ),
    Feather: (props) => (
      <View {...props}>
        <Text>{props.name}</Text>
      </View>
    ),
    AntDesign: (props) => (
      <View {...props}>
        <Text>{props.name}</Text>
      </View>
    ),
  };
});
