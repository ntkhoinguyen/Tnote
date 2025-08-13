import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { KanbanItemProps } from "@/src/utils/types";
import { kanbanItemWidth } from "@/src/utils/utils";
import {IoniconsIcon, AntDesignIcon} from "@/src/components/icon";

import { ModalSelection } from "@/src/components/modalSelection";
import { RenderItemGroupCustom } from "@/src/components/itemGroupCustom";

export const KanbanItem: React.FC<KanbanItemProps> = (props) => {
  const { task, groups, disabled, containerCard, onPress, onLongPress } = props;
  const {
    title,
    image,
    content,
    time,
    startDate,
    endDate,
    isAlways,
    tags,
    group,
    hasNotification,
  } = task;

  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const handlePress = () => {
    onPress?.(task);
  };

  const onChangeNotification = () => {
    props.onChangeNotification?.(task, !hasNotification);
  };

  const onDelete = () => {
    props.onDelete?.(task);
  };

  const onSelectGroup = (id: number) => {
    props.onSelectGroup?.(task, id);
  };

  const onOpenImage = () => {
    props.onOpenImage?.(image || "");
  };

  const RenderDeleteIcon = useCallback(() => {
    return (
      <TouchableOpacity onPress={onDelete}>
        <AntDesignIcon name="delete" size={20} color={colors.red} />
      </TouchableOpacity>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.red]);

  return (
    <TouchableOpacity
      style={[styles.card, containerCard]}
      disabled={disabled}
      onPress={handlePress}
      onLongPress={onLongPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={styles.title}>
                  {title}
                </Text>
              </View>
            </View>

            <Text style={styles.content} numberOfLines={4}>
              {content}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {image === "" ? null : (
              <TouchableOpacity onPress={onOpenImage}>
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="stretch"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.tagRow}>
          {(tags || []).map((tag, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: tag.color }]}
            >
              <Text style={styles.tagText}>{tag.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.dateContent}>
          <Text style={styles.date}>{startDate}</Text>
          {endDate || isAlways ? (
            <IoniconsIcon
              name="arrow-forward"
              size={14}
              color={colors.light_black}
              style={{
                marginHorizontal: sizes.margin.xs,
                alignSelf: "flex-end",
              }}
            />
          ) : null}
          {(isAlways || endDate) && (
            <Text style={styles.date}>{isAlways ? t("daily") : endDate}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.leftFooter}>
            <ModalSelection
              label={""}
              options={groups}
              valueId={group.id}
              onSelect={onSelectGroup}
              RenderTarget={() => (
                <View
                  style={[styles.groupColor, { backgroundColor: group.color }]}
                />
              )}
              RenderItemCustom={RenderItemGroupCustom}
            />
            <TouchableOpacity onPress={onChangeNotification}>
              <IoniconsIcon
                name={
                  hasNotification ? "notifications" : "notifications-outline"
                }
                size={22}
                color={hasNotification ? colors.primary : colors.light_gray}
              />
            </TouchableOpacity>
            <Text style={styles.time}>{time}</Text>
          </View>
          <View style={styles.rightFooter}>
            <RenderDeleteIcon />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    card: {
      width: kanbanItemWidth - sizes.padding.sm,
      marginTop: size.margin.sm,
      marginBottom: size.margin.xs,
      backgroundColor: colors.kanbanItem,
      borderRadius: size.borderRadius.sm,
      elevation: 3,
      shadowColor: colors.dark,
      shadowOpacity: 0.1,
      shadowRadius: size.borderRadius.sm,
      shadowOffset: { width: 0, height: 2 },
      flexDirection: "row",
      alignSelf: "center",
    },
    carLeftLine: {
      width: 6,
      height: "100%",
      backgroundColor: colors.primary,
      borderBottomLeftRadius: size.borderRadius.sm,
      borderTopLeftRadius: size.borderRadius.sm,
    },
    cardContent: {
      flex: 1,
      padding: size.padding.sm,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    headerLeft: { flex: 1 },
    headerRight: {
      marginLeft: size.margin.sm,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: size.borderRadius.sm,
      borderWidth: size.borderWidth.xs,
      borderColor: colors.border,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    title: {
      fontSize: size.fontSize.xl,
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.primary,
    },
    timeContent: {},
    time: {
      fontSize: size.fontSize.xl,
      color: colors.light_black,
      fontWeight: size.fontWeight.bold as "bold",
    },
    groupColor: {
      height: sizes.padding.xl,
      width: sizes.padding.xl,
      borderRadius: size.borderRadius.xs,
      flexShrink: 0,
    },
    content: {
      fontSize: size.fontSize.md,
      marginTop: size.margin.xs,
      color: colors.text,
    },
    dateContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: size.margin.sm,
    },
    tagRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: size.margin.xs,
      marginTop: size.margin.sm,
    },
    tag: {
      paddingHorizontal: size.padding.sm,
      paddingVertical: size.padding.xs,
      borderRadius: size.borderRadius.sm,
    },
    tagText: {
      color: colors.white,
      fontWeight: size.fontWeight.medium as "500",
      fontSize: size.fontSize.sm,
    },
    date: {
      fontSize: size.fontSize.md,
      fontStyle: "italic",
      marginTop: size.margin.sm,
      fontWeight: size.fontWeight.bold as "bold",
      opacity: 0.5,
      color: colors.text,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: size.margin.sm,
    },
    leftFooter: {
      flex: 1,
      flexDirection: "row",
      gap: size.margin.sm,
    },
    rightFooter: {},
    icons: {
      flexDirection: "row",
    },
  });
};

export default KanbanItem;
