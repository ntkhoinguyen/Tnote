import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { FontAwesome6 } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import { reLoadScreenByDetailUpdateAction } from "@/src/redux/updateDetail/action";
import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { stateReducerType, TagCustomType, TagType } from "@/src/utils/types";
import { ButtonCreate } from "@/src/components/createButton";
import {
  screenReload,
  showAlertDataNotExit,
  showAlertNotFoundData,
} from "@/src/utils/utils";
import { SearchBar } from "@/src/components/searchBar";
import { useRefresh } from "@/src/useHook/useRefresh";
import {
  createTagsTable,
  getTagsCustom,
  getTagsGroupByGroup,
  getAllTags,
} from "@/src/business/detail/tags";
import { getAllGroups } from "@/src/business/detail/groups";

const TagsScreen: React.FC = () => {
  const router = useRouter();
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const dispatch = useDispatch();
  const isFocus = useIsFocused();

  const isReloadScreen = useSelector(
    (state: stateReducerType) =>
      state.updateDetail.screenUpdate[screenReload.tagScreen]
  );

  const [isHaveTable, setIsHaveTable] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [tagsCustom, setTagsCustom] = useState<any>([]);
  const [sttGroupNames, setSttGroupNames] = useState<string[]>([]);

  const isMount = useRef(true);

  const onDataNotExit = () => {
    showAlertDataNotExit(router, t);
  };

  const init = async () => {
    try {
      dispatch(reLoadScreenByDetailUpdateAction(screenReload.tagScreen));
      const result = await createTagsTable();
      if (result) {
        setIsHaveTable(true);
      } else {
        onDataNotExit();
      }
    } catch (error) {
      console.log("[TagScreen][init][ERROR] ----- ", error);
      onDataNotExit();
    }
  };

  const getTags = async () => {
    try {
      const tags = await getAllTags();
      const groups = await getAllGroups();
      const tagsCustom = getTagsCustom(tags, groups);

      const tagBySearch = tagsCustom.filter(
        (item: TagCustomType) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.content.toLowerCase().includes(search.toLowerCase())
      );

      const { rows, groupNames } = getTagsGroupByGroup(tagBySearch);
      setTagsCustom(rows);
      setSttGroupNames(groupNames);
      isMount.current = false;
    } catch (error) {
      console.log("[TagScreen][getTags][ERROR] ----- ", error);
      showAlertNotFoundData(t);
    }
  };

  // init
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // init -> get list tags
  useEffect(() => {
    if (isHaveTable) {
      getTags();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHaveTable, search]);

  useEffect(() => {
    const reload = async () => {
      await getTags();
    };

    if (isFocus && isReloadScreen) {
      reload();
      dispatch(reLoadScreenByDetailUpdateAction(screenReload.tagDetail));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isFocus, isReloadScreen]);

  const onRefreshData = async () => {
    await getTags();
    setTimeout(() => {
      stop();
    }, 1000);
  };

  const { panHandlers, RefreshIndicator, stop } = useRefresh({
    onRefresh: onRefreshData,
    size: "verySmall",
  });

  const onSearch = (value: string) => {
    setSearch(value.trim());
  };

  const onPressCreate = () => {
    router.push("/screens/details/tag?id=0");
  };

  const itemSeparatorComponent = useCallback(() => {
    return <View style={styles.separator} />;
  }, [styles.separator]);

  const stickyHeaderIndices = useMemo(() => {
    return tagsCustom
      .map((item: TagCustomType, index: number) => {
        if (item.type === "title") return index;
        return null;
      })
      .filter((item: TagType) => item !== null) as number[];
  }, [tagsCustom]);

  const renderItem = useCallback(
    ({ item, index }: { item: TagCustomType; index: number }) => {
      if (item.type === "title")
        return <Title key={item.id} item={item} index={index} />;
      return (
        <Row
          key={item.id}
          item={item}
          index={index}
          sttGroupNames={sttGroupNames}
        />
      );
    },
    [sttGroupNames]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} {...panHandlers}>
      <RefreshIndicator />
      <View style={styles.searchBar}>
        <SearchBar value={search} onSearch={onSearch} />
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Header />
          <FlashList
            data={tagsCustom}
            renderItem={renderItem}
            keyExtractor={(item: TagCustomType) => item.id.toString()}
            ItemSeparatorComponent={itemSeparatorComponent}
            ListFooterComponent={itemSeparatorComponent}
            stickyHeaderIndices={stickyHeaderIndices}
            getItemType={(item: TagCustomType) => item.type || "item"}
            style={{ borderWidth: 1, borderColor: colors.border }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      <ButtonCreate onPress={onPressCreate} />
    </View>
  );
};

export const Header = () => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);
  return (
    <View style={styles.header} testID="RenderTagHeader">
      <View style={[styles.headerColumn, { width: columnsWidth.STT }]}>
        <Text style={styles.headerText}>{t("stt")}</Text>
      </View>
      <View style={[styles.headerColumn, { width: columnsWidth.title }]}>
        <Text style={styles.headerText}>{t("title")}</Text>
      </View>
      <View style={[styles.headerColumn, { width: columnsWidth.content }]}>
        <Text style={styles.headerText}>{t("content")}</Text>
      </View>
      <View style={[styles.headerColumn, { width: columnsWidth.color }]}>
        <Text style={styles.headerText}>{t("colors")}</Text>
      </View>
      <View style={[styles.headerColumn, { width: columnsWidth.detail }]}>
        <Text style={styles.headerText}>{t("detail")}</Text>
      </View>
    </View>
  );
};

export const Title = ({
  index,
  item,
}: {
  index: number;
  item: TagCustomType;
}) => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  return (
    <View style={styles.groupContent} testID="RenderTagTitle">
      <Text style={styles.groupText} numberOfLines={1}>
        {item.title || t("notInTheGroup")}
      </Text>
    </View>
  );
};

export const Row = ({
  index,
  item,
  sttGroupNames,
}: {
  index: number;
  item: TagCustomType;
  sttGroupNames: string[];
}) => {
  const { colors, sizes } = useAppContext();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const onGotoDetail = () => {
    router.push(`/screens/details/tag?id=${item.id}`);
  };

  const sttGroup = item.groupInfo?.title
    ? sttGroupNames.indexOf(item.groupInfo.title)
    : sttGroupNames.length - 1;

  return (
    <View style={styles.row} testID="RenderTagRow">
      <View style={[styles.RowColumn, { width: columnsWidth.STT }]}>
        <Text style={styles.rowText}>{index - sttGroup}</Text>
      </View>
      <View
        style={[
          styles.RowColumn,
          {
            width: columnsWidth.title,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.rowTextTitle,
            {
              color: item.color === colors.white ? colors.dark : colors.white,
              backgroundColor: item.color,
            },
          ]}
        >
          {item.title}
        </Text>
      </View>
      <View
        style={[
          styles.RowColumn,
          { width: columnsWidth.content, alignItems: "flex-start" },
        ]}
      >
        <Text style={styles.rowTextContent}>{item.content}</Text>
      </View>
      <View
        style={[
          styles.RowColumn,
          {
            width: columnsWidth.color,
          },
        ]}
      >
        <View style={[styles.rowColor, { backgroundColor: item.color }]}></View>
      </View>
      <View
        style={[
          styles.RowColumn,
          {
            width: columnsWidth.detail,
          },
        ]}
      >
        <TouchableOpacity testID="buttonGotoDetail" onPress={onGotoDetail}>
          <FontAwesome6
            name="arrow-right-from-bracket"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const columnsWidth = {
  STT: 50,
  title: 120,
  content: 170,
  color: 60,
  detail: 70,
};
const totalWidth = Object.values(columnsWidth).reduce((a, b) => a + b, 0);
const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      width: totalWidth,
      backgroundColor: colors.background,
    },
    searchBar: {
      width: "85%",
      height: 40,
      alignSelf: "flex-end",
      margin: size.margin.md,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      backgroundColor: "#e1e6ea",
      height: 40,
    },
    headerColumn: {
      justifyContent: "center",
      borderRightWidth: size.borderWidth.xs,
      borderColor: colors.border,
      paddingHorizontal: size.padding.xs,
      backgroundColor: colors.tagsHeader,
    },
    headerText: {
      fontSize: size.fontSize.lg,
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.tagsHeaderText,
    },
    separator: {
      height: sizes.borderWidth.xs,
      width: "100%",
      backgroundColor: colors.light_gray,
      opacity: 0.5,
    },
    groupContent: {
      padding: size.padding.sm,
      backgroundColor: colors.tagsGroup,
      justifyContent: "center",
    },
    groupText: {
      fontWeight: size.fontWeight.medium as "500",
      fontSize: size.fontSize.md,
      color: colors.white,
    },
    row: {
      flexDirection: "row",
      minHeight: 40,
    },
    RowColumn: {
      borderRightWidth: size.borderWidth.xs,
      borderColor: colors.border,
      padding: size.padding.xs,
      justifyContent: "center",
      alignItems: "center",
    },
    rowTextTitle: {
      fontSize: size.fontSize.md,
      color: colors.primary,
      paddingHorizontal: size.padding.sm,
      paddingVertical: size.padding.xs,
      borderRadius: size.borderRadius.sm,
    },
    rowTextContent: {
      fontSize: size.fontSize.md,
      color: colors.text,
    },
    rowColor: {
      width: 20,
      height: 20,
      borderRadius: size.borderRadius.xs,
    },
    rowText: {
      color: colors.text,
    },
  });

export default TagsScreen;
