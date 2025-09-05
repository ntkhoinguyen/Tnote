import { Alert } from "react-native";

// eslint-disable-next-line no-undef
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// eslint-disable-next-line no-undef
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// eslint-disable-next-line no-undef
jest.mock("expo-secure-store");

// eslint-disable-next-line no-undef
jest.spyOn(Alert, "alert");

// eslint-disable-next-line no-undef
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
