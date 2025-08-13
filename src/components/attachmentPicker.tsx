import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import {
  FontAwesomeIcon,
  MaterialIconsIcon,
  FontAwesome6Icon,
} from "@/src/components/icon";
import {
  AttachmentPickerType,
  OptionImageType,
  RenderCameraType,
} from "@/src/utils/types";
import { useModal } from "@/src/useHook/useModal";

export const AttachmentPicker = (props: AttachmentPickerType) => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const { multiple = true, type = "*/*", RenderItem } = props;

  const { open, close, RenderModal } = useModal({
    title: t("selectImage"),
    animationType: "slide",
    containerStyle: { justifyContent: "flex-end" },
    contentStyle: { height: 300 },
    content: (props: any) => (
      <RenderOptionImage onImage={onImage} onFolder={onFolder} />
    ),
  });

  const {
    open: openImage,
    close: closeImage,
    RenderModal: RenderModalImage,
  } = useModal({
    title: t("takeAPhoto"),
    animationType: "slide",
    contentStyle: { height: "100%" },
    content: (props: any) => <RenderCamera onSelect={onSelectImage} />,
  });

  const onPress = () => {
    open();
  };

  const onImage = () => {
    close();
    openImage();
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type,
        multiple: multiple,
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets.length > 0 && !result.canceled) {
        const files = result.assets.map((asset) => asset.uri);
        props.onSelect(files, false);
      }
    } catch (error) {
      console.log("[attachmentPicker][pickDocument] ----> ", error);
    }
  };

  const onFolder = () => {
    close();
    pickDocument();
  };

  const onSelectImage = (uri: string) => {
    closeImage();
    props.onSelect([uri], true);
  };

  return (
    <TouchableOpacity
      testID="ModalInputSelection"
      onPress={onPress}
      style={styles.container}
    >
      {RenderItem ? (
        <RenderItem />
      ) : (
        <FontAwesomeIcon name="camera" size={14} color={colors.gray} />
      )}

      {RenderModal()}
      {RenderModalImage()}
    </TouchableOpacity>
  );
};

const RenderOptionImage = (props: OptionImageType) => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const onImagePress = () => {
    props.onImage();
  };

  const onFolderPress = () => {
    props.onFolder();
  };

  return (
    <View style={styles.OptionsContainer}>
      <TouchableOpacity style={styles.optionItemContent} onPress={onImagePress}>
        <View style={styles.optionItem}>
          <FontAwesomeIcon name="camera" size={40} color={colors.gray} />
        </View>
        <Text style={styles.optionItemText}>{t("camera")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionItemContent}
        onPress={onFolderPress}
      >
        <View style={styles.optionItem}>
          <FontAwesomeIcon name="folder" size={40} color={colors.gray} />
        </View>
        <Text style={styles.optionItemText}>{t("folder")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const RenderCamera = (props: RenderCameraType) => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<"on" | "off" | "auto">("off");
  const [uri, setUri] = useState<string | null>(null);

  const cameraRef = React.useRef<CameraView>(null);

  const toggleCameraFacing = () => {
    if (facing === "back") {
      setFlashMode("off");
    }
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlashMode = () => {
    setFlashMode((current) => (current === "on" ? "off" : "on"));
  };

  const onCancel = () => {
    setUri(null);
  };

  const onSave = () => {
    props.onSelect(uri || "");
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>{t("needPermissionCamera")}</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.grantPermission}>{t("grantPermission")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onTakeAPhoto = async () => {
    try {
      if (cameraRef.current) {
        const result = await cameraRef.current?.takePictureAsync?.({
          shutterSound: false,
        });
        if (result.uri) {
          setUri(result.uri);
        } else {
          Alert.alert(t("cannotTakeAPicture"));
        }
      } else {
        Alert.alert(t("cannotTakeAPicture"));
      }
    } catch (error) {
      Alert.alert(t("cannotTakeAPicture"));
      console.error("[camera][onTakeAPhoto] ----", error);
    }
  };

  return (
    <View style={styles.CameraContainer}>
      {uri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: uri }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.actionCancelContent}>
            <TouchableOpacity onPress={onCancel}>
              <MaterialIconsIcon name="cancel" size={32} color={colors.gray} />
            </TouchableOpacity>
          </View>
          <View style={styles.actionSaveContent}>
            <TouchableOpacity onPress={onSave}>
              <FontAwesome6Icon
                name="circle-check"
                size={40}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flashMode}
          animateShutter={false}
        >
          <View style={styles.buttonContainer}>
            <View style={styles.rightButtons}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <MaterialIconsIcon
                  name="flip-camera-ios"
                  size={32}
                  color={colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleFlashMode}
                disabled={facing === "front"}
              >
                <MaterialIconsIcon
                  name={flashMode === "on" ? "flash-on" : "flash-off"}
                  size={32}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonTake} onPress={onTakeAPhoto}>
              <FontAwesomeIcon name="camera" size={32} color={colors.white} />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {},
    text: {
      fontWeight: size.fontWeight.medium as "500",
    },
    OptionsContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingVertical: size.padding.sm,
      gap: size.margin.xxl,
    },
    optionItemContent: {
      alignItems: "center",
      justifyContent: "center",
      gap: size.margin.sm,
    },
    optionItem: {
      borderWidth: size.borderWidth.xs,
      borderRadius: size.borderRadius.md,
      borderColor: colors.border,
      padding: size.padding.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.light,
    },
    optionItemText: {
      fontSize: size.fontSize.lg,
      color: colors.text,
    },
    permissionContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: size.margin.lg,
    },
    permissionText: {
      fontSize: size.fontSize.xl,
      color: colors.orange,
    },
    grantPermission: {
      padding: size.padding.md,
      borderWidth: size.borderWidth.xs,
      borderRadius: size.borderRadius.xs,
      borderColor: colors.border,
      backgroundColor: colors.primary,
      color: colors.white,
      fontWeight: size.fontWeight.bold as "bold",
      fontSize: size.fontSize.md,
    },
    CameraContainer: {
      flex: 1,
    },

    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: "transparent",
      margin: sizes.margin.lg,
      alignItems: "center",
    },
    rightButtons: {
      flex: 1,
      width: "100%",
      alignItems: "flex-end",
    },
    button: {
      marginTop: sizes.margin.xl,
    },
    buttonTake: {
      alignSelf: "center",
      marginBottom: sizes.margin.xxl,
    },
    imageContainer: {
      flex: 1,
    },
    actionImage: {
      flexDirection: "row",
      position: "absolute",
      bottom: 0,
      width: "100%",
      justifyContent: "center",
      gap: sizes.margin.xxl * 3,
    },
    image: {
      height: "100%",
      width: "100%",
    },
    actionSaveContent: {
      position: "absolute",
      width: "100%",
      alignItems: "center",
      bottom: sizes.margin.lg,
    },
    actionCancelContent: {
      position: "absolute",
      width: "100%",
      top: 0,
      alignItems: "flex-end",
      padding: sizes.padding.sm,
    },
  });
};
