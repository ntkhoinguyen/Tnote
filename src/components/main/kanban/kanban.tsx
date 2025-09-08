import React, { useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { kanbanColumnWidth, screenReloadTask } from "@/src/utils/utils";
import { GroupType, KanbanProps, TagType } from "@/src/utils/types";

import { KanbanColumn } from "@/src/components/main/kanban/kanbanColumn";
import { ButtonCreate } from "@/src/components/createButton";
import { useModalAttachment } from "@/src/useHook/useModalAttachment";

const backgroundImageDUri = require("@/assets/images/imageBackgroundKanbanD.png");
const backgroundImageLUri = require("@/assets/images/imageBackgroundKanbanL.png");

export const Kanban = (props: KanbanProps) => {
  const router = useRouter();
  const { colors, sizes, t, mode } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const { searchText } = props;

  const [groups, setGroups] = React.useState<GroupType[]>([]);
  const [tags, setTags] = React.useState<TagType[]>([]);
  const [placeHolder, setPlaceHolder] = React.useState<string>("");

  const init = async () => {
    try {
      const groups = props.groups;
      const tags = props.tags;
      const groupDefault: GroupType = {
        color: colors.primary,
        content: t("notInTheGroup"),
        id: 0,
        priority: 5,
        title: t("notInTheGroup"),
      };
      setGroups([...groups, groupDefault]);
      setTags(tags);
    } catch (error) {
      console.log("[init][Kanban][ERROR] ----- ", error);
      setPlaceHolder(t("notFoundData"));
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.groups, props.tags]);

  const onPressCreate = () => {
    router.push(`/screens/details/task?id=0?from=${screenReloadTask.kanban}`);
  };

  const { RenderModal, open } = useModalAttachment({
    animationType: "slide",
  });

  const onOpenImage = (image: string) => {
    if (image === "" || image === undefined) return;
    open(image);
  };

  const RenderPlaceholder = useCallback(() => {
    return (
      <>
        {placeHolder ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles.textPlaceholder}>{placeHolder}</Text>
          </View>
        ) : null}
      </>
    );
  }, [placeHolder, styles.textPlaceholder]);

  const renderItem = useCallback(
    ({ item }: { item: GroupType }) => {
      return (
        <KanbanColumn
          group={item}
          tags={tags}
          groups={groups}
          searchText={searchText}
          onOpenImage={onOpenImage}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tags, groups, searchText]
  );

  const backgroundImageUri = useMemo(() => {
    return mode === "dark" ? backgroundImageDUri : backgroundImageLUri;
  }, [mode]);

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImageUri} style={{ flex: 1, padding: sizes.padding.md }}>
        <RenderPlaceholder />
        <FlatList
          data={groups}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={kanbanColumnWidth}
          decelerationRate="fast"
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={true}
          extraData={searchText}
        />
        <ButtonCreate onPress={onPressCreate} />
        {RenderModal()}
      </ImageBackground>
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      // padding: size.padding.md,
      backgroundColor: colors.background,
    },
    textPlaceholder: {
      fontWeight: size.fontWeight.bold as "bold",
      fontSize: size.fontSize.xxl,
      color: colors.light_gray,
    },
  });
};
