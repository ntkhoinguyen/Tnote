import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import {
  reLoadScreenByDetailUpdateAction,
  updateDetailAction,
} from "@/src/redux/updateDetail/action";
import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { InputField } from "@/src/components/inputField";
import { ColorPicker } from "@/src/components/colorPicker";
import { ButtonCreate } from "@/src/components/createButton";
import {
  screenReload,
  showAlertDataNotExit,
  showAlertNotFoundData,
  showAlertDeleteNotSuccess,
  showAlertSaveNotSuccess,
} from "@/src/utils/utils";

import {
  TagDetailType,
  TagType,
  ModalInputSelectionItemType,
  GroupItemType,
  stateReducerType,
} from "@/src/utils/types";

import {
  createTagsTable,
  getTagById,
  updateTag,
  removeTag,
  insertTag,
} from "@/src/business/detail/tags";
import { getAllGroups } from "@/src/business/detail/groups";
import { ModalInputSelection } from "@/src/components/modalInputSelection";
import { FontAwesome5Icon, FontAwesome6Icon } from "@/src/components/icon";

const defaultTag: TagType = {
  id: 0,
  title: "",
  content: "",
  groupId: 0,
  color: defaultColors.white,
};

const TagDetail: React.FC<TagDetailType> = (props) => {
  const navigation = useNavigation();
  const { id: tagId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const isFocus = useIsFocused();

  const isReloadScreen = useSelector(
    (state: stateReducerType) =>
      state.updateDetail.screenUpdate[screenReload.tagDetail]
  );

  const [isHaveTable, setIsHaveTable] = useState(false);

  const [id, setId] = useState<number>(parseInt(tagId as string));
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [groupId, setGroupId] = useState<number>(0);
  const [groupOptions, setGroupOptions] = useState<
    ModalInputSelectionItemType[]
  >([]);
  const [color, setColor] = useState<string>(colors.white);

  const oldTag = useRef(defaultTag);
  const isMount = useRef(true);

  const setStates = (tag: TagType) => {
    oldTag.current = tag;
    setId(tag.id);
    setTitle(tag.title);
    setContent(tag.content);
    setGroupId(tag.groupId);
    setColor(tag.color);
  };

  const onDataNotExit = () => {
    return showAlertDataNotExit(router, t);
  };

  const init = async () => {
    try {
      dispatch(reLoadScreenByDetailUpdateAction(screenReload.tagDetail));
      const result = await createTagsTable();
      if (result) {
        setIsHaveTable(true);
      } else {
        onDataNotExit();
      }
    } catch (error) {
      console.log("[TagDetail][init][ERROR] ----- ", error);
      onDataNotExit();
    }
  };

  const getTagInfo = async (id: number) => {
    try {
      if (id === 0) {
        setStates(defaultTag);
      } else if (typeof id === "number" && id > 0) {
        const tag = await getTagById(id);
        if (tag) {
          setStates(tag);
        } else {
          showAlertNotFoundData(t);
          setStates(defaultTag);
        }
      }
      isMount.current = false;
    } catch (error) {
      console.log("[TagDetail][getTagInfo][ERROR] ----- ", error);
      showAlertNotFoundData(t);
      isMount.current = false;
    }
  };

  const getGroups = async () => {
    try {
      const groups = await getAllGroups();
      let haveGroups = false;
      let groupOptions: ModalInputSelectionItemType[] = [];
      for (let i = 0; i < groups.length; i++) {
        haveGroups =
          oldTag.current.groupId === groups[i].id ? true : haveGroups;
        const option: ModalInputSelectionItemType = {
          id: groups[i].id,
          title: groups[i].title,
          color: groups[i].color,
        };
        groupOptions.push(option);
      }
      if (!haveGroups) {
        setGroupId(0);
      }
      setGroupOptions(groupOptions);
    } catch (error) {
      console.log("[TagDetail][getAllGroups][ERROR] ----- ", error);
      setGroupOptions([]);
    }
  };

  const onRemove = async () => {
    if (id) {
      const result = await removeTag(id);
      if (!result) {
        showAlertDeleteNotSuccess(t);
        return;
      }
      dispatch(updateDetailAction(screenReload.tagDetail));
      navigation.setOptions({
        showButtonSave: false,
      });
      router.back();
    } else {
      router.back();
    }
  };

  // init
  useEffect(() => {
    init();
    navigation.setOptions({
      onRemove: onRemove,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // init -> get info tag
  useEffect(() => {
    if (isHaveTable) {
      getTagInfo(id);
      getGroups();
      navigation.setOptions({
        onRemove: onRemove,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHaveTable, id]);

  useEffect(() => {
    const reload = async () => {
      await getGroups();
    };

    if (isFocus && isReloadScreen) {
      reload();
      dispatch(reLoadScreenByDetailUpdateAction(screenReload.tagDetail));
    }
  }, [dispatch, isFocus, isReloadScreen]);

  useEffect(() => {
    navigation.setOptions({
      onSave: onSave,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, groupId, color, navigation]);

  useEffect(() => {
    onShowButtonSaveHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, color]);

  const onShowButtonSaveHeader = () => {
    navigation.setOptions({
      showButtonSave:
        title !== "" &&
        (title !== oldTag.current.title ||
          content !== oldTag.current.content ||
          groupId !== oldTag.current.groupId ||
          color !== oldTag.current.color),
    });
  };

  const onValidateTitle = (text: string) => {
    onShowButtonSaveHeader();
    return text.trim().length <= 0 ? t("titleNotEmpty") : undefined;
  };

  const onValidateContent = (text: string) => {
    onShowButtonSaveHeader();
    return undefined;
  };

  const onselectGroup = (groupId: number) => {
    setGroupId(groupId);
  };

  const onGotoDetailGroup = () => {
    if (groupId > 0) {
      router.push(`/screens/details/group?id=${groupId}`);
    }
  };

  const onAddNew = () => {
    router.push(`/screens/details/group?id=${0}`);
  };

  const onRemoveGroup = () => {
    setGroupId(0);
  };

  const onSelectColor = (colorSelected: string) => {
    setColor(colorSelected);
  };

  const onPressCreate = () => {
    setId(0);
  };

  const onSave = async () => {
    try {
      const tag: TagType = {
        id: id,
        title: title.trim(),
        content: content.trim(),
        groupId: groupId,
        color: color,
      };
      let result = null;
      if (tag.id === 0) {
        result = await insertTag(tag);
      } else {
        result = await updateTag(tag);
      }
      if (result || typeof result === "number") {
        oldTag.current = tag;
        navigation.setOptions({ showButtonSave: false });
        dispatch(updateDetailAction(screenReload.tagDetail));
        if (typeof result === "number") {
          oldTag.current.id = result;
          setId(result);
        }
      } else {
        showAlertSaveNotSuccess(t);
      }
    } catch (error) {
      console.log("[TagDetail][onSave][ERROR] ----- ", error);
      showAlertSaveNotSuccess(t);
    }
  };

  return (
    <View style={styles.container}>
      <InputField
        label={t("title")}
        placeholder={t("enterTitle")}
        value={title}
        multiline={true}
        labelStyle={styles.title}
        inputStyle={styles.inputStyle}
        containerStyle={{ marginTop: sizes.margin.xxl }}
        onChangeText={setTitle}
        borderType="under"
        validator={onValidateTitle}
      />
      <InputField
        label={t("content")}
        placeholder={t("enterContent")}
        value={content}
        multiline={true}
        labelStyle={styles.content}
        containerStyle={{ marginTop: sizes.margin.xxl * 2 }}
        onChangeText={setContent}
        borderType="under"
        validator={onValidateContent}
      />

      <ModalInputSelection
        label={t("group")}
        placeholder={t("selectGroup")}
        borderType="under"
        options={groupOptions}
        valueId={groupId}
        haveAddNew
        haveUnSelect
        onSelect={onselectGroup}
        onGotoDetail={onGotoDetailGroup}
        onUnSelect={onRemoveGroup}
        onAddNew={onAddNew}
        RenderItemCustom={RenderItemGroupCustom}
        containerStyle={{ marginTop: sizes.margin.xxl * 2 }}
      />

      <Text
        style={[
          styles.content,
          {
            marginTop: sizes.margin.xxl * 2,
            marginVertical: sizes.margin.md,
            fontWeight: sizes.fontWeight.medium as "500",
          },
        ]}
      >
        {t("colors")}
      </Text>
      <ColorPicker value={color} onSelect={onSelectColor} />
      {id !== 0 ? (
        <ButtonCreate onPress={onPressCreate} containerStyle={{ bottom: sizes.heightCreateButton }} />
      ) : null}
    </View>
  );
};

export const RenderItemGroupCustom = (props: GroupItemType) => {
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const { item, selected, haveUnSelect, onSelect, onUnSelect, onClose } = props;
  const isChecked = selected.includes(item.id);
  const onSelectData = () => {
    onSelect?.(item.id);
    onClose?.();
  };
  return (
    <TouchableOpacity
      testID="RenderItemGroupCustom"
      onPress={onSelectData}
      disabled={isChecked}
      style={styles.itemContainer}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={[styles.itemColor, { backgroundColor: item.color }]} />
        <Text numberOfLines={1} style={{ opacity: isChecked ? 0.5 : 1, color: colors.text }}>
          {item.title}
        </Text>
      </View>

      <View style={styles.itemContent}>
        <FontAwesome5Icon
          name="check"
          size={18}
          color={isChecked ? colors.primary : colors.iconPopupColor}
          style={{ opacity: isChecked ? 0.5 : 1 }}
        />

        {haveUnSelect ? (
          <TouchableOpacity onPress={onUnSelect}>
            <FontAwesome6Icon
              name="xmark"
              size={22}
              color={isChecked ? colors.red : colors.iconPopupColor}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: size.padding.xl,
      paddingVertical: size.padding.lg,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: size.fontSize.lg,
      fontWeight: size.fontWeight.bold as "bold",
    },
    content: {
      fontSize: size.fontSize.lg,
      color: colors.label,
    },
    inputStyle: {
      fontSize: size.fontSize.xxl,
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.primary,
    },
    itemContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: size.padding.sm,
    },
    itemContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginRight: 8,
    },
    itemColor: {
      padding: size.padding.md,
      backgroundColor: colors.primary,
      borderRadius: size.borderRadius.md,
      marginRight: size.margin.sm,
      borderColor: colors.border,
      borderWidth: size.borderWidth.xs,
    },
  });

export default TagDetail;
