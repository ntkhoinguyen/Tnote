// __mocks__/react-native-reanimated.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Reanimated = require("react-native-reanimated/mock");

// Fix for: useSharedValue returns undefined in test env
Reanimated.default.call = () => {};
module.exports = Reanimated;