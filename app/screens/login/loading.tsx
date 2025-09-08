import React, { useEffect, useRef } from "react";
import { router } from "expo-router";
import { Alert, View } from "react-native";

import { LoadingIcon } from "@/src/components/loadingIcon";
import { useUser } from "@/src/useHook/userContext";
import { useAppContext } from "@/src/useHook/useAppContext";
import { getUserInfo, initDatabase } from "@/src/business/login/loading";
import { ensureAttachmentsDir } from "@/src/utils/utils";

const LoadingScreen: React.FC = () => {
  const { setUser } = useUser();
  const { colors } = useAppContext();

  const progress = useRef(0);
  const init = async () => {
    try {
      const result = await initDatabase();
      if (result) {
        progress.current = progress.current + 50;
      }
      await ensureAttachmentsDir();
      const userInfo = await getUserInfo();
      if (userInfo !== false && userInfo !== null) {
        setUser(userInfo);
        progress.current = progress.current + 50;
      }
      if (progress.current === 100) {
        router.replace("/screens/main/home");
      } else {
        Alert.alert("Lỗi", "Không thể truy cập dữ liệu");
        setTimeout(() => {
          router.replace("/screens/login/login");
        }, 3000);
      }
    } catch (error) {
      console.log("[LoadingScreen] init error", error);
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoadingIcon size="large" />
    </View>
  );
};

export default LoadingScreen;
