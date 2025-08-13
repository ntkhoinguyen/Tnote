const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.khoinguyen2901.tnote.dev";
  }

  if (IS_PREVIEW) {
    return "com.khoinguyen2901.tnote.preview";
  }

  return "com.khoinguyen2901.tnote";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Tnote (Dev)";
  }

  if (IS_PREVIEW) {
    return "Tnote (Preview)";
  }

  return "Tnote";
};

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  runtimeVersion: "1.0.2",
  ios: {
    ...config.ios,
    buildNumber: "1",
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    versionCode: 1,
    package: getUniqueIdentifier(),
  },
});
