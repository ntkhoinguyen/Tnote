// app/create-account.tsx
import React, { useMemo, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

import { InputField } from "@/src/components/inputField";
import { useAppContext } from "@/src/useHook/useAppContext";
import { sizes } from "@/src/themes/sizes";
import { defaultColors } from "@/src/themes/colors";
import { AppLogo } from "@/src/components/appLogo";
import { ButtonField } from "@/src/components/buttonField";
import { FontAwesomeIcon } from "@/src/components/icon";
import { useNotification } from "@/src/useHook/useNotification";

import { getUserInfo } from "@/src/business/login/createAccount";

const ForgetPassword = () => {
  const router = useRouter();
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const { sendNotification } = useNotification();

  const [email, setEmail] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (text: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text) ? undefined : t("emailValidate");
  };

  const validateSecurity = (text: string): string | undefined => {
    return text.length < 1 ? t("securityCode1Charater") : undefined;
  };

  const handleForget = async () => {
    try {
      const result = await getUserInfo(email, securityCode);
      if (result) {
        const body = `
        ${t("username")}: ${result.username} \n
        ${t("password")}: ${result.password}`;
        sendNotification(t("getPassword"), body);
      } else {
        setError(t("accountError"));
      }
    } catch (e) {
      console.log("[handleLogin][login] ----> ", e);
      setError(t("accountError"));
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
          label={t("securityCode")}
          placeholder={t("enterSecurityCode")}
          type="password"
          value={securityCode}
          onChangeText={setSecurityCode}
          validator={validateSecurity}
          containerStyle={{ marginTop: sizes.margin.xl }}
        />

        {error ? (
          <Text style={styles.warning}>
            <FontAwesomeIcon name="warning" size={20} color={colors.red} />
            {"    "}
            {error}
          </Text>
        ) : null}

        <ButtonField
          text={t("getPassword")}
          type="fill"
          color={colors.primary}
          onPress={handleForget}
          containerStyle={{
            marginTop: sizes.margin.xxl * 4,
            width: "100%",
            paddingVertical: sizes.padding.sm,
          }}
        />

        {/* Nút quay về login */}
        <ButtonField
          text={t("backToLogin")}
          type="text"
          color={colors.primary}
          onPress={handleGoback}
          containerStyle={{ marginTop: sizes.margin.xl }}
        />
      </View>
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      padding: size.padding.md,
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.background,
      paddingTop: size.heightHeader * 1.2,
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

export default ForgetPassword; // use auto in _layout
