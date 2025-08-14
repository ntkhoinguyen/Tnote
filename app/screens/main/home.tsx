import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { TabView } from "react-native-tab-view";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { IoniconsIcon } from "@/src/components/icon";
import { useNotification } from "@/src/useHook/useNotification";

import { Kanban } from "@/src/components/main/kanban/kanban";
import { Calendar } from "@/src/components/main/calendar/calendar";
import { screenReload } from "@/src/utils/utils";
import { reLoadScreenByDetailUpdateAction } from "@/src/redux/updateDetail/action";
import { GroupType, stateReducerType, TagType } from "@/src/utils/types";
import { getAllGroups } from "@/src/business/detail/groups";
import { getAllTags } from "@/src/business/detail/tags";

export default function HomeScreen() {
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "kanban", title: "Kanban" },
    { key: "calendar", title: "Calendar" },
  ]);

  const [isMount, setIsMount] = useState(true);

  const [groups, setGroups] = React.useState<GroupType[]>([]);
  const [tags, setTags] = React.useState<TagType[]>([]);

  const { setMounted } = useNotification();

  const isReloadScreen = useSelector(
    (state: stateReducerType) =>
      state.updateDetail.screenUpdate[screenReload.homeScreen]
  );

  const getData = async () => {
    const groups = await getAllGroups();
    const tags = await getAllTags();
    setGroups(groups);
    setTags(tags);
    setIsMount(false);
    setMounted(true);
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const reload = async () => {
      await getData();
    };

    if (isFocus && isReloadScreen) {
      reload();
      dispatch(reLoadScreenByDetailUpdateAction(screenReload.homeScreen));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isFocus]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "kanban":
        return <Kanban searchText={searchText} groups={groups} tags={tags} />;
      case "calendar":
        return (
          <Calendar
            searchText={searchText}
            isCurrentTab={index === 1}
            groups={groups}
            tags={tags}
          />
        );
      default:
        return null;
    }
  };

  const onChangeTextSearch = (text: string) => {
    setSearchText(text);
  };

  if (isMount) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <SearchBar onChangeText={onChangeTextSearch} searchText={searchText} />
        <View style={styles.naviBar}>
          <TouchableOpacity onPress={() => setIndex(0)} style={styles.tabBtn}>
            <IoniconsIcon
              name="grid-outline"
              size={20}
              color={index === 0 ? "#007bff" : "#888"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIndex(1)} style={styles.tabBtn}>
            <IoniconsIcon
              name="calendar-outline"
              size={20}
              color={index === 1 ? "#007bff" : "#888"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab View nội dung */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={() => null} // Ẩn tab bar mặc định
        swipeEnabled={false}
      />
    </View>
  );
}

type SearchBarType = {
  onChangeText?: (text: string) => void;
  searchText?: string;
};

const SearchBar = (props: SearchBarType) => {
  const { searchText = "" } = props;
  const { colors } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors]);

  const [search, setSearch] = useState(searchText);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    setSearch(searchText);
  }, [searchText]);

  const onSearch = () => {
    inputRef.current?.blur();
    props.onChangeText?.(search);
  };

  return (
    <View style={styles.search}>
      <TouchableOpacity style={styles.iconContainer} onPress={onSearch}>
        <IoniconsIcon name="search" size={20} style={styles.iconSearch} />
      </TouchableOpacity>

      <TextInput
        ref={inputRef}
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: { flex: 1 },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: size.padding.sm,
      borderBottomWidth: size.borderWidth.xs,
      borderColor: colors.border,
    },
    naviBar: {
      flexDirection: "row",
    },
    search: {
      flexDirection: "row",
      flex: 1,
    },
    iconContainer: {
      borderRadius: size.borderRadius.xs,
      padding: size.padding.xs,
      marginRight: size.margin.sm,
      backgroundColor: colors.primary,
    },
    iconSearch: {
      color: colors.white,
    },
    input: {
      flex: 1,
      paddingVertical: size.padding.xs,
      borderColor: colors.border,
      borderWidth: size.borderWidth.xs,
      borderRadius: size.borderRadius.xs,
      padding: size.padding.xs,
      paddingHorizontal: size.padding.sm,
    },
    tabBtn: {
      padding: size.padding.xs,
      marginLeft: size.margin.xs,
    },
    scene: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
