// eslint-disable-next-line no-undef
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// eslint-disable-next-line no-undef
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// eslint-disable-next-line no-undef
jest.mock("@expo/vector-icons", () => {
  const View = require("react-native").View;
  return {
    MaterialIcons: (props) => <View {...props} />,
    FontAwesome: (props) => <View {...props} />,
    Ionicons: (props) => <View {...props} />,
    FontAwesome5: (props) => <View {...props} />,
    FontAwesome6: (props) => <View {...props} />,
    MaterialCommunityIcons: (props) => <View {...props} />,
    AntDesign: (props) => <View {...props} />,
    Octicons: (props) => <View {...props} />,
    SimpleLineIcons: (props) => <View {...props} />,
    EvilIcons: (props) => <View {...props} />,
    Feather: (props) => <View {...props} />,
  };
});
