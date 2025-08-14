import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";

import { useAppContext } from "@/src/useHook/useAppContext";
import { useUser } from "@/src/useHook/userContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { InputField } from "@/src/components/inputField";
import {
  saveSetting,
  saveSettingInfoLogin,
  saveSettingImage,
} from "@/src/business/main/setting";
import { DateTimeInput } from "@/src/components/datetimeInput";
import {
  IoniconsIcon,
  FontAwesomeIcon,
  MaterialIconsIcon,
} from "@/src/components/icon";
import { AttachmentPicker } from "@/src/components/attachmentPicker";
import { useModalAttachment } from "@/src/useHook/useModalAttachment";

const SettingsScreen: React.FC = () => {
  const { colors, sizes, t, mode, setMode, locale, setLocale } =
    useAppContext();
  const { user, setUser } = useUser();

  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const { RenderModal, open } = useModalAttachment({
    animationType: "slide",
  });

  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone || "");
  const [password, setPassword] = useState(user.password || "");

  const usernameRef = useRef<any>(null);
  const [editUserName, setEditUserName] = useState(false);

  const handleLogout = () => {
    router.replace("/screens/login/login");
  };

  const onOpenImage = () => {
    open(user.avatar);
  };

  const onOpenCoverbackground = () => {
    open(user.coverBackground);
  };

  const onPickCoverbackground = async (uris: string[], isMove: boolean) => {
    try {
      if (uris.length > 0 && uris[0] !== "") {
        const newData = { ...user, coverBackground: uris[0] };
        const newUser = await saveSettingImage(
          newData,
          "coverBackground",
          isMove
        );
        if (!newUser) {
          Alert.alert(t("cannotSaveImage"));
        } else {
          setUser(newUser);
        }
      } else {
        Alert.alert(t("cannotSelectImage"));
      }
    } catch (error) {
      console.error("[setting][onPickCoverImage] ----", error);
      Alert.alert(t("errorSelectImage"));
    }
  };

  const onPickImageAvatar = async (uris: string[], isMove: boolean) => {
    try {
      if (uris.length > 0 && uris[0] !== "") {
        const newData = { ...user, avatar: uris[0] };
        const newUser = await saveSettingImage(newData, "avatar", isMove);
        if (!newUser) {
          Alert.alert(t("cannotSaveImage"));
        } else {
          setUser(newUser);
        }
      } else {
        Alert.alert(t("cannotSelectImage"));
      }
    } catch (error) {
      console.error("[setting][onPickCoverImage] ----", error);
      Alert.alert(t("errorSelectImage"));
    }
  };

  const onEditUserName = () => {
    setEditUserName(true);
  };

  const validateUsername = (text: string): string | undefined => {
    return text.length < 4 ? t("userName4Charater") : undefined;
  };

  const onBlurUsername = async () => {
    try {
      if (validateUsername(username)) {
        return;
      }
      if (username !== user.username) {
        const newData = { ...user, username: username };
        const newUser = await saveSettingInfoLogin(newData);
        if (!newUser) {
          Alert.alert(t("cannotSaveUsername"));
          setUsername(user.username); // Reset username to previous value
          return;
        } else {
          setUser(newUser);
        }
      }
      setEditUserName(false); // Reset edit mode
    } catch (error) {
      console.log("[setting][onBlurUsername] ----", error);
      Alert.alert(t("errorSaveUsername"));
      setEditUserName(false);
      setUsername(user.username); // Reset username to previous value
    }
  };

  const onSetPushNotification = async () => {
    try {
      const newData = { ...user, pushNotification: !user.pushNotification };
      const newUser = await saveSetting(newData);
      if (!newUser) {
        Alert.alert(t("cannotUpdateNotification"));
      } else {
        setUser(newUser);
      }
    } catch (error) {
      console.log("[setting][onSetPushNotification] ----", error);
      Alert.alert(t("errorUpdateNotification"));
    }
  };

  const onSetMode = async () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const onBlurPhone = async () => {
    try {
      if (phone !== user.phone) {
        const newData = { ...user, phone: phone };
        const newUser = await saveSetting(newData);
        if (!newUser) {
          Alert.alert(t("cannotSavePhoneNumber"));
          setPhone(user.phone); // Reset phone to previous value
          return;
        } else {
          setUser(newUser);
        }
      }
    } catch (error) {
      console.log("[setting][onBlurPhone] ----", error);
      Alert.alert(t("errorSavePhoneNumber"));
      setPhone(user.phone); // Reset phone to previous value
    }
  };

  const validatePassword = (text: string): string | undefined => {
    return text.length < 6 ? t("password6Charater") : undefined;
  };

  const onBlurPassword = async () => {
    try {
      if (validatePassword(password)) {
        return;
      }
      // Check if password has changed
      if (password !== user.password) {
        const newData = { ...user, password: password };
        const newUser = await saveSettingInfoLogin(newData);
        if (!newUser) {
          Alert.alert(t("cannotSavePassword"));
          setPassword(user.password); // Reset password to previous value
          return;
        } else {
          setUser(newUser);
        }
      }
    } catch (error) {
      console.log("[setting][onBlurPassword] ----", error);
      Alert.alert(t("errorSavePassword"));
      setPassword(user.password); // Reset password to previous value
    }
  };

  const onConfirmDate = async (date: string) => {
    try {
      const newData = { ...user, birthday: date };
      const newUser = await saveSetting(newData);
      if (!newUser) {
        Alert.alert(t("cannotSaveBirthday"));
      } else {
        setUser(newUser);
      }
    } catch (error) {
      console.log("[setting][onConfirmDate] ----", error);
      Alert.alert(t("errorSaveBirthday"));
    }
  };

  const onChangeVI = async () => {
    setLocale("vi");
  };

  const onChangeEN = async () => {
    setLocale("en");
  };

  const RenderBackground = () => {
    return (
      <View style={styles.cameraIconCoverPhotoContent}>
        <FontAwesomeIcon name="camera" size={16} color={colors.gray} />
        <Text style={styles.cameraIconCoverPhotoText}>{t("takeAPhoto")}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={sizes.heightHeader}
    >
      <View style={styles.container}>
        {/* cover image */}
        <View style={styles.quoteContainer}>
          {user.coverBackground !== "" ? (
            <TouchableOpacity
              style={styles.coverPhoto}
              onPress={onOpenCoverbackground}
            >
              <Image
                source={{ uri: user.coverBackground }}
                style={styles.coverPhoto}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          ) : null}
          <AttachmentPicker
            onSelect={onPickCoverbackground}
            multiple={false}
            type="image/*"
            RenderItem={RenderBackground}
          />
        </View>

        {/* avatar */}
        <View style={styles.avatarContainer}>
          {/* avatar */}
          <View style={styles.avatarContent}>
            {user.avatar !== "" ? (
              <TouchableOpacity onPress={onOpenImage}>
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : null}
            <View style={styles.cameraIcon}>
              <AttachmentPicker
                onSelect={onPickImageAvatar}
                multiple={false}
                type="image/*"
              />
            </View>
          </View>

          {/* name and nickname */}
          <View style={styles.nameContainer}>
            <View style={styles.nameContent}>
              <View style={{ flex: 1 }}>
                <InputField
                  ref={usernameRef}
                  value={username}
                  borderType={editUserName ? "under" : "none"}
                  editable={editUserName}
                  validator={validateUsername}
                  onChangeText={setUsername}
                  onBlur={onBlurUsername}
                  inputStyle={styles.name}
                />
              </View>
              {editUserName ? (
                <TouchableOpacity
                  testID="saveUsername"
                  onPress={onBlurUsername}
                  style={{
                    alignSelf: "flex-start",
                    marginTop: sizes.margin.md,
                  }}
                >
                  <FontAwesomeIcon
                    name="check"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  testID="editUsername"
                  onPress={onEditUserName}
                  style={{
                    alignSelf: "flex-start",
                    marginTop: sizes.margin.md,
                  }}
                >
                  <FontAwesomeIcon
                    name="pencil"
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* notification */}
        <View style={styles.checkboxRow}>
          <Pressable
            testID="pushNotificationButton"
            onPress={onSetPushNotification}
          >
            {user.pushNotification ? (
              <IoniconsIcon
                name="notifications"
                size={24}
                color={colors.primary}
              />
            ) : (
              <IoniconsIcon
                name="notifications-outline"
                size={24}
                color={colors.gray}
              />
            )}
          </Pressable>
          <Pressable testID="shakeButton" onPress={onSetMode}>
            {mode === "light" ? (
              <MaterialIconsIcon
                name="light-mode"
                size={24}
                color={colors.primary}
              />
            ) : (
              <MaterialIconsIcon
                name="dark-mode"
                size={24}
                color={colors.primary}
              />
            )}
          </Pressable>
          <View style={styles.translateContainer}>
            <View style={styles.translateContent}>
              <Pressable
                onPress={onChangeVI}
                style={[
                  styles.translateItemVI,
                  locale === "vi" && styles.active,
                ]}
              >
                <Text
                  style={[
                    styles.textTranslateItem,
                    locale === "vi" && { color: colors.white },
                  ]}
                >
                  VI
                </Text>
                <Image
                  source={require("@/assets/images/vietnam.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </Pressable>
              <Pressable
                onPress={onChangeEN}
                style={[
                  styles.translateItemEN,
                  locale === "en" && styles.active,
                ]}
              >
                <Text
                  style={[
                    styles.textTranslateItem,
                    locale === "en" && { color: colors.white },
                  ]}
                >
                  EN
                </Text>
                <Image
                  source={require("@/assets/images/united-kingdom.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>
        </View>
        {/* info */}
        <ScrollView style={styles.infoContainer}>
          <InputField
            label={t("email")}
            type="email"
            labelIcon="envelope"
            value={user.email}
            borderType={"none"}
            editable={false}
            inputStyle={{ color: colors.gray, fontWeight: "bold" }}
          />

          <InputField
            label={t("password")}
            type="password"
            labelIcon="lock"
            value={password}
            borderType={"under"}
            onChangeText={setPassword}
            onBlur={onBlurPassword}
            validator={validatePassword}
          />

          <InputField
            label={t("phoneNumber")}
            type="phone"
            labelIcon="phone"
            placeholder={t("enterPhoneNumber")}
            value={phone}
            borderType={"under"}
            onChangeText={setPhone}
            onBlur={onBlurPhone}
            containerStyle={{ marginTop: sizes.margin.xxl }}
          />

          <DateTimeInput
            mode="date"
            format="DD/MM/YYYY"
            label={t("birthday")}
            borderType={"under"}
            value={user.birthday}
            editable={false}
            onChangeText={onConfirmDate}
            maximumDate={new Date()}
            containerStyle={{ marginTop: sizes.margin.xxl }}
          />
        </ScrollView>

        {/* logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>{t("logOut")}</Text>
          <MaterialIconsIcon name="logout" size={24} color={colors.red} />
        </TouchableOpacity>

        {RenderModal()}
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    quoteContainer: {
      height: 170,
      justifyContent: "center",
    },
    coverPhoto: {
      flex: 1,
      width: "100%",
    },
    cameraIconCoverPhotoContent: {
      padding: size.padding.xs,
      paddingHorizontal: size.padding.sm,
      backgroundColor: colors.white,
      borderRadius: size.borderRadius.xs,
      position: "absolute",
      right: 17,
      bottom: 10,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    cameraIconCoverPhotoText: {
      marginLeft: size.margin.sm,
      color: colors.dark,
      fontWeight: size.fontWeight.medium as "500",
    },
    avatarContainer: {
      flexDirection: "row",
      width: "100%",
      paddingHorizontal: size.padding.md,
    },
    avatarContent: {
      position: "relative",
      marginTop: -size.margin.xxl,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: size.borderWidth.xs,
      borderColor: colors.border,
      backgroundColor: colors.white,
    },
    cameraIcon: {
      position: "absolute",
      right: 0,
      bottom: 0,
      backgroundColor: colors.light_gray,
      padding: size.padding.xs,
      borderRadius: size.borderRadius.xs,
    },
    nameContainer: {
      justifyContent: "center",
      flex: 1,
      marginLeft: size.margin.md,
    },
    nameContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flex: 1,
    },
    name: {
      fontSize: size.fontSize.xl,
      fontWeight: size.fontWeight.medium as "500",
      marginRight: size.margin.md,
      borderColor: colors.border,
      color: colors.label,
    },
    checkboxRow: {
      flexDirection: "row",
      marginVertical: size.margin.xl,
      paddingHorizontal: size.padding.xl,
      alignItems: "center",
      gap: 16,
    },
    infoContainer: {
      paddingHorizontal: size.padding.xxl,
    },
    translateContainer: {
      flex: 1,
      alignItems: "flex-end",
    },
    translateContent: {
      flexDirection: "row",
      backgroundColor: colors.light_gray,
      borderRadius: size.borderRadius.xs,
    },
    translateItemVI: {
      backgroundColor: colors.light,
      padding: size.padding.xs,
      paddingHorizontal: size.padding.sm,
      borderTopLeftRadius: size.borderRadius.xs,
      borderBottomLeftRadius: size.borderRadius.xs,
      flexDirection: "row",
      alignItems: "center",
      gap: size.margin.xs,
      opacity: 0.3,
    },
    translateItemEN: {
      backgroundColor: colors.light,
      padding: size.padding.xs,
      paddingHorizontal: size.padding.sm,
      borderTopRightRadius: size.borderRadius.xs,
      borderBottomRightRadius: size.borderRadius.xs,
      flexDirection: "row",
      alignItems: "center",
      gap: size.margin.xs,
      opacity: 0.3,
    },
    active: {
      backgroundColor: colors.primary,
      opacity: 1,
    },
    textTranslateItem: {
      fontWeight: size.fontWeight.bold as "bold",
    },
    logo: {
      height: 20,
      width: 20,
    },
    logoutButton: {
      padding: size.padding.md,
      paddingHorizontal: size.padding.xxl,
      marginVertical: size.margin.xl,
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      gap: size.margin.sm,
    },
    logoutText: {
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.red,
      textAlign: "center",
    },
  });

export default SettingsScreen;
