// app/create-account.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

import { InputField } from "@/src/components/inputField";
import { useAppContext } from "@/src/useHook/useAppContext";
import { sizes } from "@/src/themes/sizes";
import { defaultColors } from "@/src/themes/colors";
import { AppLogo } from "@/src/components/appLogo";
import { ButtonField } from "@/src/components/buttonField";
import { FontAwesomeIcon } from "@/src/components/icon";
import { useLoading } from "@/src/useHook/useLoading";

import {
  checkHaveEmail,
  checkValidateEmail,
  createAccount,
} from "@/src/business/login/createAccount";

const CreateAccountScreen = () => {
  const router = useRouter();
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [isHaveAccount, setIsHaveAccount] = useState(false);

  const { open, close, LoadingComponent } = useLoading({
    size: "small",
    color: colors.primary,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const isHaveAccount = await checkHaveEmail();
        if (isHaveAccount) setIsHaveAccount(true);
      } catch (error) {
        setIsHaveAccount(false);
        console.log("[checkHaveEmail][useEffect] ------", error);
      }
    };
    init();
  }, []);

  const validateEmail = (text: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text) ? undefined : "Email không hợp lệ";
  };

  const validateUsername = (text: string): string | undefined => {
    return text.length < 4 ? "Username phải trên 4 ký tự" : undefined;
  };

  const validatePassword = (text: string): string | undefined => {
    return text.length < 6 ? "Mật khẩu tối thiểu 6 ký tự" : undefined;
  };

  const validateSecurity = (text: string): string | undefined => {
    return text.length < 1 ? "Mật khẩu tối thiểu 1 ký tự" : undefined;
  };

  const handleSubmit = async () => {
    if (
      validateEmail(email) === undefined &&
      validateUsername(username) === undefined &&
      validatePassword(password) === undefined &&
      validateSecurity(securityCode) === undefined
    ) {
      try {
        open(); // open loading component for setting data.
        const isValidateEmail = await checkValidateEmail(email);
        if (isValidateEmail) {
          Alert.alert("Thống báo", "Email này đã được sử dụng");
          close();
          return;
        }
        const result = await createAccount(
          email,
          username,
          password,
          securityCode
        );
        if (result) {
          setTimeout(() => {
            router.back();
          }, 500);
        } else {
          close();
          Alert.alert("Lỗi", "Không thể lưu dữ liệu");
        }
      } catch (e) {
        console.log("[CreateAccount] --> handleSubmit error", e);
        close();
        Alert.alert("Lỗi", "Không thể lưu dữ liệu");
      }
      close();
    } else {
      Alert.alert("Lưu ý", "Chưa nhập đúng dữ liệu");
    }
  };

  const handleGoback = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <AppLogo />
        <InputField
          label={t("email")}
          type="email"
          placeholder={t("enterEmail")}
          required
          value={email}
          onChangeText={setEmail}
          validator={validateEmail}
          containerStyle={{ marginTop: sizes.margin.xxl * 2 }}
        />
        <InputField
          label={t("username")}
          placeholder={t("enterUsername")}
          required
          value={username}
          onChangeText={setUsername}
          validator={validateUsername}
          containerStyle={{ marginTop: sizes.margin.xl }}
        />
        <InputField
          label={t("password")}
          placeholder={t("enterPassword")}
          type="password"
          required
          value={password}
          onChangeText={setPassword}
          validator={validatePassword}
          containerStyle={{ marginTop: sizes.margin.xl }}
        />

        <InputField
          label={t("securityCode")}
          placeholder={t("enterSecurityCode")}
          type="password"
          required
          value={securityCode}
          onChangeText={setSecurityCode}
          validator={validateSecurity}
          containerStyle={{ marginTop: sizes.margin.xl }}
        />

        {isHaveAccount ? (
          <Text testID="createWarning" style={styles.warning}>
            <FontAwesomeIcon name="warning" size={20} color={colors.red} />
            {"   "}
            {t("createAccountWarning")}
          </Text>
        ) : null}

        <ButtonField
          text={t("createAccount")}
          type="fill"
          color={colors.primary}
          onPress={handleSubmit}
          containerStyle={{ marginTop: sizes.margin.xxl * 2 }}
        />

        {/* Nút quay về login */}
        <TouchableOpacity onPress={handleGoback}>
          <Text style={styles.backToLogin}>
            Đã có tài khoản? Quay lại đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
      <LoadingComponent />
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      padding: size.padding.md,
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.backgroundMode,
      paddingTop: size.heightHeader * 1.2,
    },
    buttonWrapper: {
      marginTop: size.margin.md,
      marginBottom: size.margin.md,
    },
    backToLogin: {
      textAlign: "center",
      fontSize: size.fontSize.md,
      color: colors.primary,
      fontWeight: size.fontWeight.medium as "500",
      marginTop: size.margin.md,
    },
    warning: {
      color: colors.red,
      fontSize: size.fontSize.md,
      marginVertical: size.margin.md,
    },
  });

export default CreateAccountScreen; // use auto in _layout
