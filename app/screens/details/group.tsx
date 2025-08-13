import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import { updateDetailAction } from "@/src/redux/updateDetail/action";
import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { InputField } from "@/src/components/inputField";
import {
  priorityGroup,
  screenReload,
  showAlertDataNotExit,
  showAlertNotFoundData,
  showAlertDeleteNotSuccess,
  showAlertSaveNotSuccess,
} from "@/src/utils/utils";
import { ColorPicker } from "@/src/components/colorPicker";
import { ButtonCreate } from "@/src/components/createButton";
import {
  GroupDetailProps,
  GroupType,
  PriorityGroupType,
} from "@/src/utils/types";
import {
  createGroupTable,
  getGroupById,
  updateGroup,
  removeGroup,
  insertGroup,
} from "@/src/business/detail/groups";

import { PriorityText } from "@/src/components/priority";
import { ModalInputSelection } from "@/src/components/modalInputSelection";

const defaultValue = {
  id: 0,
  title: "",
  content: "",
  priority: 5 as PriorityGroupType, // không ưu tiên
  color: defaultColors.white,
};

const GroupDetail: React.FC<GroupDetailProps> = (props) => {
  const navigation = useNavigation();
  const { id: groupId } = useLocalSearchParams();
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const dispatch = useDispatch();
  const router = useRouter();

  const [isHaveTable, setIsHaveTable] = useState(false);

  const [id, setId] = useState(parseInt(groupId as string));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<PriorityGroupType>(5);
  const [color, setColor] = useState(colors.white);

  const oldGroup = useRef(defaultValue);

  const setStates = (group: GroupType) => {
    oldGroup.current = group;
    setId(group.id);
    setTitle(group.title);
    setContent(group.content);
    setPriority(group.priority);
    setColor(group.color);
  };

  const onDataNotExit = () => {
    return showAlertDataNotExit(router, t);
  };

  const checkTableExit = async () => {
    return await createGroupTable();
  };

  const init = async () => {
    try {
      const result = await checkTableExit();
      if (result) {
        setIsHaveTable(true);
      } else {
        onDataNotExit();
      }
    } catch (error) {
      console.log("[GroupDetail][init][ERROR] ----- ", error);
      onDataNotExit();
    }
  };

  const getGroupInfo = async (id: number) => {
    try {
      if (id === 0) {
        setStates(defaultValue);
      } else if (typeof id === "number" && id > 0) {
        const group = await getGroupById(id);
        if (group) {
          setStates(group);
        } else {
          showAlertNotFoundData(t);
          setStates(defaultValue);
        }
      }
    } catch (error) {
      console.log("[GroupDetail][getGroupInfo][ERROR] ----- ", error);
      showAlertNotFoundData(t);
    }
  };

  const onRemove = async () => {
    try {
      if (id) {
        const result = await removeGroup(id);
        if (!result) {
          showAlertDeleteNotSuccess(t);
          return;
        }
        dispatch(updateDetailAction(screenReload.groupDetail));
        navigation.setOptions({
          showButtonSave: false,
        });
        router.back();
      } else {
        router.back();
      }
    } catch (error) {
      console.log("[GroupDetail][onRemove][ERROR] ----- ", error);
      showAlertDeleteNotSuccess(t);
    }
  };

  useEffect(() => {
    init();
    navigation.setOptions({
      onRemove: onRemove,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isHaveTable) {
      getGroupInfo(id);
      navigation.setOptions({
        onRemove: onRemove,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHaveTable, id]);

  useEffect(() => {
    navigation.setOptions({
      onSave: onSave,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, priority, color, navigation]);

  useEffect(() => {
    onShowButtonSaveHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priority, color]);

  const onShowButtonSaveHeader = () => {
    navigation.setOptions({
      showButtonSave:
        title !== "" &&
        (title !== oldGroup.current.title ||
          content !== oldGroup.current.content ||
          priority !== oldGroup.current.priority ||
          color !== oldGroup.current.color),
    });
  };

  const onValidateTitle = (text: string): string | undefined => {
    onShowButtonSaveHeader();
    return text.trim().length <= 0 ? t("titleNotEmpty") : undefined;
  };

  const onValidateContent = (text: string): string | undefined => {
    onShowButtonSaveHeader();
    return undefined;
  };

  const onselectPriority = (value: number) => {
    setPriority(value as PriorityGroupType);
  };

  const onSelectColor = (color: string) => {
    setColor(color);
  };

  const onPressCreate = () => {
    setId(0);
  };

  const onSave = async () => {
    try {
      const group: GroupType = {
        id: id,
        title: title.trim(),
        content: content.trim(),
        priority: priority,
        color: color,
      };
      let result = null;
      if (group.id === 0) {
        result = await insertGroup(group);
      } else {
        result = await updateGroup(group);
      }
      if (result || typeof result === "number") {
        oldGroup.current = group;
        navigation.setOptions({ showButtonSave: false });
        dispatch(updateDetailAction(screenReload.groupDetail));
        if (typeof result === "number") {
          oldGroup.current.id = result;
          setId(result);
        }
      } else {
        showAlertSaveNotSuccess(t);
      }
    } catch (error) {
      console.log("[GroupDetail][onSave][ERROR] ----- ", error);
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
        borderType="under"
        onChangeText={setTitle}
        validator={onValidateTitle}
      />
      <InputField
        label={t("content")}
        placeholder={t("enterContent")}
        value={content}
        multiline={true}
        labelStyle={styles.content}
        containerStyle={{ marginTop: sizes.margin.xxl * 2 }}
        borderType="under"
        onChangeText={setContent}
        validator={onValidateContent}
      />

      <ModalInputSelection
        label={t("priority")}
        options={priorityGroup}
        valueId={priority}
        labelStyle={styles.content}
        placeholder={t("enterPriority")}
        borderType="under"
        onSelect={onselectPriority}
        RenderItemCustom={PriorityText}
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
  });
export default GroupDetail;
