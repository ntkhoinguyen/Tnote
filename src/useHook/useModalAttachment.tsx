import { useState } from "react";
import { Image, Alert } from "react-native";
import * as Sharing from "expo-sharing";

import { ModalWrapper } from "@/src/components/modalWrapper";
import { ModalAttachmentType } from "@/src/utils/types";
import { imageExtensions } from "@/src/utils/utils";
import { useAppContext } from "./useAppContext";

export const useModalAttachment = (props: ModalAttachmentType) => {
  const { animationType, containerStyle } = props;
  const { t } = useAppContext();

  const [visible, setVisible] = useState(false);
  const [uri, setUri] = useState("");
  const [title, setTitle] = useState("");
  const [isImage, setIsImage] = useState(false);

  const open = async (uri: string) => {
    const filename = uri.split("/").pop() || "";
    setTitle(filename);
    const ext = uri.split(".").pop()?.toLowerCase?.() ?? "";
    const isImageFile = imageExtensions.includes(ext);
    setIsImage(isImageFile);

    if (isImageFile) {
      setUri(uri);
      setVisible(true);
    } else {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert(t("cannotOpenFile"));
        }
      } catch (error) {
        console.warn("Failed to open file:", error);
        Alert.alert(t("cannotOpenFile"));
      }
    }
  };

  const close = () => {
    setVisible(false);
  };

  const RenderModal = () => {
    return (
      <ModalWrapper
        title={title}
        visible={visible}
        onClose={close}
        animationType={animationType}
        containerStyle={containerStyle}
      >
        {isImage ? (
          <Image
            source={{ uri: uri }}
            style={{ height: "100%", width: "100%" }}
            resizeMode="contain"
          />
        ) : null}
      </ModalWrapper>
    );
  };

  return { RenderModal, open, close };
};
