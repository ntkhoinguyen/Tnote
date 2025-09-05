const colors = {
  red: "#f03e3e",
  green: "#37b24d",
  blue: "#1c7ed6",
  yellow: "#f59f00",
  black: "#000000",
  white: "#ffffff",
  gray: "#495057",
  pink: "#d6336c",
  violet: "#7048e8",
  indigo: "#4263eb",
  cyan: "#1098ad",
  teal: "#0ca678",
  lime: "#74b816",
  orange: "#f76707",
  dark: "#242424",
  grape: "#ae3ec9",
  light: "#f2f2f2",
  light_gray: "#e6e6e6",
  dark_gray: "#404040",
  light_blue: "#add8e6",
  dark_blue: "#00008b",
  light_green: "#90ee90",
  dark_green: "#006400",
  light_red: "#ff9999",
  dark_red: "#8b0000",
  light_yellow: "#ffffe0",
  dark_yellow: "#808000",
  light_black: "#808080",
  dark_black: "#262626",
};

const colorsPicker = [
  colors.white,
  colors.red,
  colors.green,
  colors.blue,
  colors.yellow,
  colors.cyan,
  colors.pink,
  colors.violet,
  colors.teal,
  colors.lime,
  colors.orange,
  colors.grape,
];

// a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z

const defaultColors = {
  ...colors,
  background: "#ffffff",
  backgroundLoading: colors.white,
  backgroundModal: colors.white,
  backgroundPopup: colors.light,
  border: "#c0c0c0",
  error: "#ff0000",
  headerColor: "#0099FF",
  iconColor: colors.dark,
  iconPopupColor: colors.white,
  inputTextColor: "#000000",
  internetWarning: colors.light,
  kanbanGroupName: colors.light,
  kanbanItem: colors.white,
  geminiBackground: colors.light,
  label: "#000000",
  placeHolderText: colors.light_gray,
  primary: "#0099FF",
  secondary: "#B0B2B4",
  separator: colors.light_gray,
  searchBar: colors.white,
  success: "#00ff00",
  tabbarColor: colors.white,
  tagsHeader: colors.light_gray,
  tagsHeaderText: colors.dark,
  tagsGroup: colors.light_blue,
  text: "#000000",
  userAskBackground: colors.light_blue,
  warning: "#ffff00",
};

const lightColors = {
  ...defaultColors,
};

const darkColors = {
  ...colors,
  // background: "#272924",
  background: "#000000",
  backgroundLoading: colors.gray,
  backgroundModal: colors.dark_black,
  backgroundPopup: colors.dark_black,
  border: "#c0c0c0",
  error: "#ff0000",
  headerColor: colors.black,
  iconColor: colors.white,
  iconPopupColor: colors.dark_black,
  internetWarning: colors.dark,
  inputTextColor: colors.light_gray,
  kanbanGroupName: colors.gray,
  kanbanItem: colors.dark,
  geminiBackground: colors.dark_gray,
  label: colors.white,
  placeHolderText: colors.gray,
  primary: "#0099FF",
  secondary: "yellow",
  separator: colors.white,
  searchBar: colors.dark_black,
  success: "#00ff00",
  tabbarColor: colors.black,
  tagsHeader: colors.dark_black,
  tagsHeaderText: colors.white,
  tagsGroup: colors.light_black,
  text: "#f7f7f7",
  userAskBackground: colors.dark_black,
  warning: "#ffff00",
};

const getColorsByMode = (mode: string) => {
  if (mode === "dark") {
    return { ...lightColors, ...darkColors };
  } else {
    return { ...darkColors, ...lightColors };
  }
};

export {
  lightColors,
  darkColors,
  defaultColors,
  colors,
  colorsPicker,
  getColorsByMode,
};
