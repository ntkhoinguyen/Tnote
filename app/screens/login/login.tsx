// LoginScreen.tsx
import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { AppLogo } from "@/src/components/appLogo";
import { InputField } from "@/src/components/inputField";
import { ButtonField } from "@/src/components/buttonField";
import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import {
  checkCreateNewAccount,
  checkLoginByAccount,
} from "@/src/business/login/login";

const LoginScreen = () => {
  const router = useRouter();
  const { colors, sizes, t, appName, appVersion } = useAppContext();
  const [username, setUsername] = useState("Kn95");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | undefined>(undefined);

  const onCreateNewAccount = () => {
    router.push("/screens/login/createAccount");
  };

  const onForgetPassword = () => {
    router.push("/screens/login/forgetPassword");
  };

  const handleLogin = async () => {
    try {
      const result = await checkLoginByAccount(username, password);
      if (result) {
        router.replace("/screens/login/loading");
      } else {
        setError(t("wrongAccount"));
      }
    } catch (e) {
      console.log("[handleLogin][login] ----> ", e);
      Alert.alert(t("errorCannotGetData"));
    }
  };

  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  useFocusEffect(
    useCallback(() => {
      const checkNewAccount = async () => {
        const data = await checkCreateNewAccount();
        if (data) setUsername(data);
      };
      checkNewAccount();
    }, [])
  );

  const onResetError = () => {
    if (error) {
      setError(undefined);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppLogo />
        <Text style={styles.title}>{appName}</Text>
        <InputField
          label={t("username")}
          placeholder={t("enterUsername")}
          value={username}
          onChangeText={setUsername}
        />
        <InputField
          label={t("password")}
          placeholder={t("enterPassword")}
          type="password"
          labelIcon="lock"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          errorText={error}
          onFocus={onResetError}
          containerStyle={{ marginTop: sizes.margin.xl }}
        />

        <View style={styles.linksContainer}>
          <ButtonField
            text={t("createAccount")}
            type="text"
            color={colors.primary}
            onPress={onCreateNewAccount}
          />
          <ButtonField
            text={t("forgetPassword")}
            type="text"
            color={colors.teal}
            onPress={onForgetPassword}
            containerStyle={{ opacity: 0.7 }}
          />
        </View>

        <ButtonField
          text={t("logIn")}
          type="fill"
          color={colors.primary}
          onPress={handleLogin}
          containerStyle={{
            marginTop: sizes.margin.xxl * 2,
            width: "100%",
            paddingVertical: sizes.padding.sm,
          }}
        />
      </View>

      <Text style={styles.versionText}>{appVersion}</Text>
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: size.padding.xl,
    },
    title: {
      fontSize: size.fontSize.xxl,
      fontWeight: size.fontWeight.bold as "bold",
      marginBottom: size.margin.xl,
      color: colors.green,
    },
    linksContainer: {
      flexDirection: "row",
      width: "100%",
      marginTop: size.margin.sm,
      justifyContent: "space-between",
    },
    versionText: {
      color: colors.light_gray,
      alignSelf: "center",
      marginBottom: size.margin.xl,
    },
  });

export default LoginScreen;
