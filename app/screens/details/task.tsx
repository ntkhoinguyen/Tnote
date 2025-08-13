import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import moment from "moment";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";

import { updateTaskAction } from "@/src/redux/updateTask/action";
import { reLoadScreenByDetailUpdateAction } from "@/src/redux/updateDetail/action";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import {
  ModalInputSelectionItemType,
  TagType,
  TaskType,
  stateReducerType,
} from "@/src/utils/types";
import { InputField } from "@/src/components/inputField";
import {
  FontAwesomeIcon,
  IoniconsIcon,
  FontAwesome6Icon,
} from "@/src/components/icon";
import {
  screenReload,
  screenReloadTask,
  showAlertDataNotExit,
  showAlertNotFoundData,
  showAlertDeleteNotSuccess,
  showAlertSaveNotSuccess,
} from "@/src/utils/utils";
import { Many2ManyTags } from "@/src/components/many2manyTags";
import { DateTimeInput } from "@/src/components/datetimeInput";
import { usePlaceHolderLoading } from "@/src/useHook/usePlaceHolderLoading";
import { ButtonCreate } from "@/src/components/createButton";
import { AttachmentPicker } from "@/src/components/attachmentPicker";

import {
  createTasksTable,
  removeTask,
  getTaskById,
  insertTask,
  updateTask,
  deleteUriAttachments,
} from "@/src/business/detail/task";
import { getAllGroups } from "@/src/business/detail/groups";
import { getAllTags } from "@/src/business/detail/tags";
import { ModalInputSelection } from "@/src/components/modalInputSelection";
import { RenderItemGroupCustom } from "@/src/components/itemGroupCustom";
import { useModalAttachment } from "@/src/useHook/useModalAttachment";
import { Attachments } from "@/src/components/attachments";

const defaultTask = {
  id: 0,
  title: "",
  image: "",
  hasNotification: true,
  hasShake: true,
  groupId: 0,
  createDate: moment().format("HH:mm DD/MM/YYYY"),
  startDate: moment().format("DD/MM/YYYY"),
  time: "",
  isAlways: 0,
  endDate: "",
  sequence: 1,
  tagsId: [],
  attachments: [],
  content: "",
};

const TaskDetail: React.FC = () => {
  const navigation = useNavigation();
  const { id: taskId, from } = useLocalSearchParams() as {
    id: string;
    index: string;
    from: keyof typeof screenReloadTask;
  };
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const dispatch = useDispatch();
  const router = useRouter();

  const isFocus = useIsFocused();

  const isReloadScreen = useSelector(
    (state: stateReducerType) =>
      state.updateDetail.screenUpdate[screenReload.taskDetail]
  );

  const { placeholderLoading, openLoading, closeLoading } =
    usePlaceHolderLoading({ size: "small" });

  const [isHaveTable, setIsHaveTable] = useState(false);

  const [id, setId] = useState<number>(parseInt(taskId as string));
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string | undefined>("");
  const [hasNotification, setHasNotification] = useState<boolean>(true);
  const [hasShake, setHasShake] = useState<boolean>(true);
  const [time, setTime] = useState<string>("");
  const [sequence, setSequence] = useState<number>(1);
  const [createDate] = useState<string>(moment().format("HH:mm DD/MM/YYYY"));
  const [startDate, setStartDate] = useState<string>(
    moment().format("DD/MM/YYYY")
  );
  const [endDate, setEndDate] = useState<string>("");
  const [isAlways, setIsAlways] = useState<number>(0);
  const [groupOptions, setGroupOptions] = useState<
    ModalInputSelectionItemType[]
  >([]);
  const [groupId, setGroupId] = useState(0);
  const [tagsId, setTagsId] = useState<number[]>([]);
  const [tagOptions, setTagOptions] = useState<TagType[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachmentDel, setAttachmentDel] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");

  const oldTask = useRef<TaskType>(defaultTask);
  const isMount = useRef(true);

  const setStates = (task: TaskType) => {
    oldTask.current = task;
    setId(task.id);
    setTitle(task.title);
    setImage(task.image);
    setHasNotification(task.hasNotification);
    setHasShake(task.hasShake);
    setGroupId(task.groupId);
    setStartDate(task.startDate);
    setEndDate(task.endDate);
    setTime(task.time);
    setIsAlways(task.isAlways);
    setSequence(task.sequence);
    setTagsId(task.tagsId);
    setAttachments(task.attachments);
    setContent(task.content);
  };

  const onDataNotExit = () => {
    showAlertDataNotExit(router, t);
  };

  const init = async () => {
    try {
      dispatch(reLoadScreenByDetailUpdateAction(screenReload.taskDetail));
      const result = await createTasksTable();
      if (result) {
        setIsHaveTable(true);
      } else {
        onDataNotExit();
      }
    } catch (error) {
      console.log("[TaskDetail][init][ERROR] ----- ", error);
      onDataNotExit();
    }
  };

  const onRemove = async () => {
    if (id) {
      const result = await removeTask(id, oldTask.current.groupId);
      if (!result) {
        showAlertDeleteNotSuccess(t);
        return;
      }
      dispatch(updateTaskAction(from, [oldTask.current.groupId]));
      navigation.setOptions({
        showButtonSave: false,
      });
      router.back();
    } else {
      router.back();
    }
  };

  const getTaskInfo = async (id: number) => {
    try {
      if (id === 0) {
        setStates(defaultTask);
      } else if (typeof id === "number" && id > 0) {
        const task = await getTaskById(id);
        if (task) {
          setStates(task);
        } else {
          showAlertNotFoundData(t);
          setStates(defaultTask);
        }
      }
      isMount.current = false;
    } catch (error) {
      console.log("[TaskDetail][getTaskInfo][ERROR] ----- ", error);
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
          oldTask.current.groupId === groups[i].id ? true : haveGroups;
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
      console.log("[TaskDetail][getAllGroups][ERROR] ----- ", error);
      setGroupOptions([]);
    }
  };

  const getTags = async () => {
    try {
      const tagsId = await getAllTags();
      setTagOptions(tagsId);
    } catch (error) {
      console.log("[TaskDetail][getAllTags][ERROR] ----- ", error);
      setTagOptions([]);
    }
  };

  // init
  useEffect(() => {
    openLoading();
    init();
    navigation.setOptions({
      onRemove: onRemove,
    });
    closeLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // init -> get info tag
  useEffect(() => {
    const getInfo = async () => {
      await getTaskInfo(id);
      await getGroups();
      await getTags();
      navigation.setOptions({
        onRemove: onRemove,
      });
    };

    if (isHaveTable) {
      getInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHaveTable, id]);

  useEffect(() => {
    const reload = async () => {
      await getGroups();
      await getTags();
    };

    if (isFocus && isReloadScreen) {
      reload();
      dispatch(reLoadScreenByDetailUpdateAction(screenReload.taskDetail));
    }
  }, [dispatch, isFocus, isReloadScreen]);

  useEffect(() => {
    navigation.setOptions({
      onSave: onSave,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    image,
    hasNotification,
    hasShake,
    groupId,
    startDate,
    endDate,
    time,
    isAlways,
    sequence,
    taskId,
    tagsId,
    attachments,
    content,
  ]);

  useEffect(() => {
    onShowButtonSaveHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    image,
    hasNotification,
    hasShake,
    groupId,
    startDate,
    endDate,
    time,
    isAlways,
    sequence,
    tagsId,
    attachments,
    content,
  ]);

  const onShowButtonSaveHeader = () => {
    try {
      navigation.setOptions({
        showButtonSave:
          title !== "" &&
          (title !== oldTask.current.title ||
            image !== oldTask.current.image ||
            content !== oldTask.current.content ||
            hasNotification !== oldTask.current.hasNotification ||
            hasShake !== oldTask.current.hasShake ||
            groupId !== oldTask.current.groupId ||
            startDate !== oldTask.current.startDate ||
            endDate !== oldTask.current.endDate ||
            time !== oldTask.current.time ||
            isAlways !== oldTask.current.isAlways ||
            sequence !== oldTask.current.sequence ||
            tagsId.length !== oldTask.current.tagsId.length ||
            (tagsId.length === oldTask.current.tagsId.length &&
              tagsId.length !== 0 &&
              !tagsId.every(
                (value, index) => value === oldTask.current.tagsId[index]
              )) ||
            attachments.length !== oldTask.current.attachments.length ||
            (attachments.length === oldTask.current.attachments.length &&
              attachments.length !== 0 &&
              !attachments.every(
                (value, index) => value === oldTask.current.attachments[index]
              ))),
      });
    } catch (error) {
      console.log("[TaskDetail][onShowButtonSaveHeader][ERROR] ----- ", error);
    }
  };

  const onSave = async () => {
    try {
      const task: TaskType = {
        id,
        title,
        image,
        hasNotification,
        hasShake,
        groupId,
        createDate,
        startDate,
        endDate,
        time,
        isAlways,
        sequence,
        tagsId,
        attachments,
        content,
      };
      let result = null;
      if (task.id === 0) {
        result = await insertTask(task);
      } else {
        const isUpdateImage = task.image !== oldTask.current.image;
        result = await updateTask(
          task,
          oldTask.current.groupId,
          groupId,
          isUpdateImage
        );
      }
      if (result || typeof result === "number") {
        await deleteUriAttachments(attachmentDel);
        dispatch(updateTaskAction(from, [oldTask.current.groupId, groupId]));
        navigation.setOptions({ showButtonSave: false });
        oldTask.current = task;
        if (typeof result === "number") {
          oldTask.current.id = result;
          setId(result);
        }
        setAttachmentDel([]);
      } else {
        showAlertSaveNotSuccess(t);
      }
    } catch (error) {
      console.log("[TaskDetail][onSave][ERROR] ----- ", error);
      showAlertSaveNotSuccess(t);
    }
  };

  const onValidateTitle = (text: string) => {
    onShowButtonSaveHeader();
    return text.trim().length <= 0 ? t("titleNotEmpty") : undefined;
  };

  const onChangeImage = async (uri: string[], isMove: boolean) => {
    try {
      if (uri && uri.length > 0) {
        setImage(uri[0]);
      } else {
        Alert.alert(t("cannotSelectImage"));
      }
    } catch (error) {
      Alert.alert(t("cannotSelectImage"));
      console.error("[task][onChangeImage] ----", error);
    }
  };

  const { RenderModal, open } = useModalAttachment({
    animationType: "slide",
  });

  const onOpenImage = () => {
    if (image === "" || image === undefined) return;
    open(image);
  };

  const onChangeNotification = () => {
    setHasNotification(!hasNotification);
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

  const onChangeStartDate = (date: string) => {
    setStartDate(date);
  };

  const onChangeEndDate = (date: string) => {
    setEndDate(date);
  };

  const onChangeTime = (time: string) => {
    setTime(time);
  };

  const onChangeAlway = () => {
    setIsAlways(isAlways === 0 ? 1 : 0);
  };

  const onSelectTag = (id: number) => {
    setTagsId([...tagsId, id]);
  };

  const onDeleteTag = (id: number) => {
    setTagsId(tagsId.filter((item) => item !== id));
  };

  const onAddNewTag = () => {
    router.push("/screens/details/tag?id=0");
  };

  const onChangeContent = (content: string) => {
    setContent(content);
  };

  const onPressCreate = () => {
    setId(0);
  };

  const onAddAttachments = (uri: string[], isMove: boolean) => {
    setAttachments([...attachments, ...uri]);
  };

  const onPreviewAttachment = (uri: string) => {
    open(uri);
  };

  const onDeleteAttachment = (uri: string) => {
    setAttachments(attachments.filter((item) => item !== uri));
    setAttachmentDel([...attachmentDel, uri]);
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {placeholderLoading()}
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* header */}
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <InputField
                  value={title}
                  onChangeText={setTitle}
                  placeholder={t("enterTitle")}
                  inputStyle={styles.title}
                  borderType="under"
                  multiline={true}
                  numberOfLines={4}
                  validator={onValidateTitle}
                />
              </View>

              <View style={styles.headerRight}>
                <TouchableOpacity disabled={!image} onPress={onOpenImage}>
                  <Image
                    source={{ uri: image }}
                    style={styles.image}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
                <View style={styles.cameraIconCoverPhotoContent}>
                  <AttachmentPicker
                    onSelect={onChangeImage}
                    multiple={false}
                    type="image/*"
                    RenderItem={() => (
                      <FontAwesomeIcon
                        name="camera"
                        size={20}
                        color={colors.light_blue}
                      />
                    )}
                  />
                </View>

                <View style={styles.notiContent}>
                  <TouchableOpacity onPress={onChangeNotification}>
                    <IoniconsIcon
                      name={
                        hasNotification ? "notifications" : "notifications-off"
                      }
                      size={22}
                      color={
                        hasNotification ? colors.primary : colors.light_gray
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ------- info --------------*/}

            {/* nhóm */}
            <ModalInputSelection
              label={t("group")}
              placeholder={t("selectGroup")}
              borderType="under"
              options={groupOptions}
              valueId={groupId}
              haveAddNew
              haveUnSelect={true}
              containerStyle={{ marginTop: sizes.margin.lg }}
              onSelect={onselectGroup}
              onGotoDetail={onGotoDetailGroup}
              onUnSelect={onRemoveGroup}
              onAddNew={onAddNew}
              RenderItemCustom={RenderItemGroupCustom}
            />

            {/* ngày tạo */}
            <InputField
              value={createDate}
              label={t("createDate")}
              borderType="under"
              editable={false}
              inputStyle={styles.disable}
              labelStyle={styles.labelStyle}
              containerStyle={{ marginTop: sizes.margin.xxl }}
            />

            {/* date */}
            <View style={[styles.rowDate, { marginTop: sizes.margin.xxl }]}>
              <View style={{ flex: 1 }}>
                <DateTimeInput
                  mode="date"
                  format="DD/MM/YYYY"
                  label={t("startDate")}
                  labelStyle={styles.labelStyle}
                  borderType="under"
                  value={startDate}
                  editable={false}
                  onChangeText={onChangeStartDate}
                  maximumDate={
                    endDate ? moment(endDate, "DD/MM/YYYY").toDate() : undefined
                  }
                />
              </View>
              <IoniconsIcon
                name="arrow-forward"
                size={18}
                color={colors.gray}
                style={{
                  marginHorizontal: sizes.margin.xs,
                  alignSelf: "flex-end",
                  marginBottom: sizes.margin.xs,
                }}
              />
              <View style={{ flex: 1 }}>
                <DateTimeInput
                  mode="date"
                  format="DD/MM/YYYY"
                  label={t("endDate")}
                  labelStyle={[
                    styles.labelStyle,
                    isAlways ? styles.disable : {},
                  ]}
                  borderType="under"
                  value={endDate}
                  editable={false}
                  disabled={isAlways === 0 ? false : true}
                  inputStyle={isAlways ? styles.disable : {}}
                  onChangeText={onChangeEndDate}
                  minimumDate={
                    startDate
                      ? moment(startDate, "DD/MM/YYYY").toDate()
                      : undefined
                  }
                />
              </View>
            </View>

            {/* time */}
            <View style={[styles.rowTime, { marginTop: sizes.margin.xxl }]}>
              <View style={[styles.rowTime]}>
                <Text
                  style={[
                    styles.labelStyle,
                    { marginTop: sizes.margin.md, width: 70 },
                  ]}
                >
                  {t("time")} :
                </Text>
                <DateTimeInput
                  mode="time"
                  format="HH:mm"
                  value={time}
                  label=""
                  borderType="under"
                  editable={false}
                  onChangeText={onChangeTime}
                />
              </View>
              <View style={[styles.rowTime]}>
                <Text
                  style={[
                    styles.labelStyle,
                    { marginTop: sizes.margin.sm, width: 80, marginLeft: 20 },
                  ]}
                >
                  {t("daily")} :
                </Text>
                <TouchableOpacity
                  onPress={onChangeAlway}
                  style={{ marginBottom: 4 }}
                >
                  <FontAwesomeIcon
                    name={isAlways ? "check-square" : "square-o"}
                    size={22}
                    color={isAlways ? colors.primary : colors.light_gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* tag */}
            <Many2ManyTags
              options={tagOptions}
              valueIds={[...tagsId]}
              label={t("tags")}
              haveUnSelect={true}
              haveAddNew={true}
              containerStyle={{ marginTop: sizes.margin.xxl }}
              onSelect={onSelectTag}
              onUnSelect={onDeleteTag}
              onAddNew={onAddNewTag}
            />

            {/* attachments  */}
            <View style={{ marginTop: sizes.margin.xxl }}>
              <View style={styles.attachmentContent}>
                <Text style={[styles.attachmentTitle]}>{t("attachments")}</Text>
                <AttachmentPicker
                  onSelect={onAddAttachments}
                  multiple={true}
                  type="*/*"
                  RenderItem={() => (
                    <FontAwesome6Icon
                      name="plus"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                />
              </View>
              <Attachments
                uri={attachments}
                onPreview={onPreviewAttachment}
                onDelete={onDeleteAttachment}
              />
            </View>

            {/* content */}
            <View style={{ marginTop: sizes.margin.md }}>
              <ContentTabView
                content={content}
                onChangeContent={onChangeContent}
              />
            </View>
            <View style={{ marginBottom: 80 }}></View>
          </ScrollView>
          {id !== 0 ? (
            <ButtonCreate
              onPress={onPressCreate}
              containerStyle={{ bottom: 90, right: 10 }}
            />
          ) : null}
        </View>
        {RenderModal()}
      </KeyboardAvoidingView>
    </View>
  );
};

type ContentType = {
  content: string;
  onChangeContent?: (content: string) => void;
};

const ContentTabView = (props: ContentType) => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([{ key: "content", title: "Content" }]);

  const RenderTabView = useMemo(() => {
    return (
      <View style={styles.tabBarHeader}>
        <TouchableOpacity style={styles.tabBarItem}>
          <Text style={styles.titleBar}>{t("content")}</Text>
        </TouchableOpacity>
      </View>
    );
  }, [styles.tabBarHeader, styles.tabBarItem, styles.titleBar, t]);

  const renderContent = () => {
    return (
      <RenderContent
        value={props.content}
        onChangedText={props.onChangeContent}
      />
    );
  };

  const renderScene = SceneMap({
    content: renderContent,
  });

  return (
    <View style={{ height: TabarHeight, width: "100%" }}>
      {RenderTabView}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width, height: TabarHeight }}
        renderTabBar={() => null} // Ẩn tab mặc định
      />
    </View>
  );
};

const RenderContent = (props: any) => {
  const { t } = useAppContext();

  const [content, setContent] = useState(props.value);
  const inputRefEdit = useRef<TextInput>(null);
  const [isFocus, setIsFocus] = useState(false);
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  useEffect(() => {
    setContent(props.value);
  }, [props.value]);

  const handleValidate = () => {
    props.onChangedText?.(content);
  };

  const handleKeyboardHide = () => {
    if (isFocus) {
      if (inputRefEdit?.current?.blur) {
        inputRefEdit?.current?.blur();
        handleValidate();
      }
    }
  };

  useEffect(() => {
    if (isFocus) {
      const keyboardHideListener = Keyboard.addListener(
        "keyboardDidHide",
        handleKeyboardHide
      );
      return () => {
        keyboardHideListener.remove(); // đừng quên remove
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus, content]);

  const onFocus = () => {
    setIsFocus(true);
  };

  return (
    <View style={styles.contentContainer}>
      <TextInput
        ref={inputRefEdit}
        placeholder={t("enterContent")}
        value={content}
        multiline={true}
        onChangeText={setContent}
        onBlur={handleValidate}
        onFocus={onFocus}
        style={styles.textContent}
        textAlignVertical="top"
      />
    </View>
  );
};

const TabarHeight = 300;

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: size.padding.lg,
    },
    header: {
      width: "100%",
      flexDirection: "row",
    },
    title: {
      flex: 1,
      color: colors.primary,
      fontSize: size.fontSize.xxl,
      fontWeight: size.fontWeight.bold as "bold",
      height: 87,
    },
    headerRight: {
      marginLeft: size.margin.sm,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: size.borderRadius.sm,
      borderWidth: size.borderWidth.xs,
      borderColor: colors.border,
    },
    cameraIconCoverPhotoContent: {
      padding: size.padding.xs,
      backgroundColor: colors.backgroundPopup,
      borderRadius: size.borderRadius.xs,
      position: "absolute",
      right: 4,
      bottom: 16,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    labelStyle: {
      fontSize: size.fontSize.lg,
      color: colors.label,
      marginBottom: size.margin.sm,
      fontWeight: size.fontWeight.medium as "500",
    },
    notiContent: {
      flexDirection: "row",
      gap: 10,
      marginTop: size.margin.sm,
    },
    disable: {
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.light_gray,
    },
    rowDate: {
      flexDirection: "row",
      gap: 10,
      flex: 1,
      alignItems: "flex-end",
    },
    rowTime: {
      flexDirection: "row",
      gap: 10,
      flex: 1,
      alignItems: "center",
    },
    timeContent: {
      flexDirection: "row",
      gap: 10,
      marginTop: size.margin.xl,
    },
    time: {
      flex: 1,
    },
    tabBarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tabBarItem: {
      padding: size.padding.sm,
      backgroundColor: colors.light_gray,
      borderRadius: size.borderRadius.xs,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
    },
    titleBar: {
      fontSize: size.fontSize.md,
      color: colors.gray,
      fontWeight: size.fontWeight.medium as "500",
    },
    contentContainer: {
      flex: 1,
      borderWidth: size.borderWidth.xs,
      borderColor: colors.border,
      borderRadius: size.borderRadius.xs,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      padding: size.padding.sm,
    },
    textContent: {
      height: TabarHeight,
      fontSize: size.fontSize.md,
      color: colors.text,
    },
    attachmentContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: sizes.margin.md,
      borderColor: colors.border,
      borderBottomWidth: sizes.borderWidth.xs,
      paddingBottom: sizes.padding.sm,
    },
    attachmentTitle: {
      fontSize: size.fontSize.lg,
      color: colors.label,
      fontWeight: sizes.fontWeight.medium as "500",
    },
  });
};

export default TaskDetail;
