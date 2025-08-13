import React, { useMemo } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { AttachmentsType, AttachmentType } from "@/src/utils/types";
import { imageExtensions } from "../utils/utils";
import {
  IoniconsIcon,
  FoundationIcon,
  AntDesignIcon,
  FontAwesomeIcon,
} from "./icon";

export const fileIcons = {
  pdf: (
    <AntDesignIcon
      name="pdffile1"
      size={24}
      color={defaultColors.red}
      style={{ marginTop: sizes.margin.xs }}
    />
  ),
  doc: (
    <FoundationIcon
      name="page-doc"
      size={24}
      color={defaultColors.primary}
      style={{ marginTop: sizes.margin.xs }}
    />
  ),
  docx: (
    <FoundationIcon
      name="page-doc"
      size={24}
      color={defaultColors.primary}
      style={{ marginTop: sizes.margin.xs }}
    />
  ),
  document: (
    <IoniconsIcon
      name="document"
      size={24}
      color={defaultColors.yellow}
      style={{ marginTop: sizes.margin.xs }}
    />
  ),
};

export const Attachments = (props: AttachmentsType) => {
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const { uri, onPreview, onDelete } = props;

  return (
    <View style={styles.container}>
      {(uri || []).map((item, index) => {
        return (
          <RenderAttachmentItem
            uri={item}
            key={"attachment" + index}
            onPreview={onPreview}
            onDelete={onDelete}
          />
        );
      })}
    </View>
  );
};

const RenderAttachmentItem = (props: AttachmentType) => {
  const { uri, onPreview, onDelete } = props;

  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const fileName = useMemo(() => {
    const split = uri.split("/");
    return split[split.length - 1];
  }, [uri]);

  const fileType = useMemo(() => {
    const split = uri.split(".");
    return split[split.length - 1].toLowerCase();
  }, [uri]);

  const isImage = useMemo(() => {
    return imageExtensions.includes(fileType);
  }, [fileType]);

  const fileIcon = useMemo(() => {
    return (
      fileIcons[fileType as keyof typeof fileIcons] || fileIcons["document"]
    );
  }, [fileType]);

  const onPreviewAttachment = () => {
    onPreview?.(uri);
  };

  const onDeleteAttachment = () => {
    onDelete?.(uri);
  };

  return (
    <TouchableOpacity
      style={styles.attachmentContainer}
      onPress={onPreviewAttachment}
    >
      {isImage ? (
        <Image source={{ uri: uri }} style={styles.image} />
      ) : (
        <View style={styles.IconContent}>
          {fileIcon}
          <View style={{ flex: 1 }}>
            <Text numberOfLines={3} style={styles.text}>
              {fileName}
            </Text>
          </View>
        </View>
      )}
      {onDelete ? (
        <TouchableOpacity style={styles.delete} onPress={onDeleteAttachment}>
          <FontAwesomeIcon name="close" size={24} color={colors.red} />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flexWrap: "wrap",
      flexDirection: "row",
      width: "100%",
      gap: sizes.margin.sm,
    },
    attachmentContainer: {
      borderRadius: size.borderRadius.sm,
      borderColor: colors.border,
      borderWidth: sizes.borderWidth.xs,
      padding: sizes.padding.sm,
    },
    image: {
      height: 50,
      width: 50,
    },
    IconContent: {
      height: 50,
      width: 150,
      flexDirection: "row",
      backgroundColor: colors.background,
    },
    text: {
      fontSize: size.fontSize.md,
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.text,
      marginLeft: size.margin.sm,
      marginRight: size.margin.lg,
    },
    delete: {
      position: "absolute",
      top: 0,
      right: sizes.margin.xs,
    },
  });
};
