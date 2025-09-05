import { LayoutChangeEvent, TextInputProps } from "react-native";
import { PopoverPlacement } from "react-native-popover-view";
import { screenReload } from "@/src/utils/utils";
import {
  RELOAD_SCREEN_BY_DETAIL_UPDATE,
  UPDATE_DETAILS,
} from "@/src/redux/updateDetail/action";
import {
  RELOAD_SCREEN_BY_TASK_UPDATE,
  UPDATE_TASK,
} from "@/src/redux/updateTask/action";

// ----------------------------- Update State Reducer -----------------------------
export type updateDetailStateType = {
  screenUpdate: {
    [key: (typeof screenReload)[keyof typeof screenReload]]: boolean;
  }; // screenReload
};

export type updateTaskStateType = {
  screenUpdate: {
    notification: boolean;
    calendar: boolean;
    kanban: boolean;
    kanbanColumnIds: number[];
  };
};

export type stateReducerType = {
  updateDetail: updateDetailStateType;
  updateTask: updateTaskStateType;
};

export type actionUpdateDetailsType = {
  type: typeof UPDATE_DETAILS;
  payload: { value: { fromScreen: string } };
};

export type actionReloadScreenUpdateDetailsType = {
  type: typeof RELOAD_SCREEN_BY_DETAIL_UPDATE;
  payload: { value: { fromScreen: string } };
};

export type actionUpdateTaskType = {
  type: typeof UPDATE_TASK;
  payload: { value: { fromScreen: string; kanbanColumnIds: number[] } };
};

export type actionReloadScreenUpdateTaskType = {
  type: typeof RELOAD_SCREEN_BY_TASK_UPDATE;
  payload: { value: { fromScreen: string } };
};

// ----------------------------- Icon Symbol -----------------------------
export type IconType = {
  name: string;
  size?: number;
  color?: string;
  style?: object;
};

// ----------------------------- Button Field -----------------------------
export type ButtonFieldType = {
  text?: string;
  containerStyle?: object;
  type: "fill" | "outline" | "text";
  color?: string;
  disabled?: boolean;
  LeftSection?: React.ComponentType<any>;
  RightSection?: React.ComponentType<any>;
  onPress?: () => void;
};

// ---------------------------- Input Field -----------------------------
export type InputFieldProps = TextInputProps & {
  ref?: any;
  label?: string;
  labelIcon?: string;
  value: string;
  required?: boolean;
  errorText?: string;
  type?: "default" | "email" | "password" | "phone";
  borderType?: "default" | "under" | "none";
  placeholder?: string;
  editable?: boolean;
  containerStyle?: object;
  inputStyle?: object;
  labelStyle?: object;
  multiline?: boolean;
  LeftSection?: React.ComponentType<any>;
  RightSection?: React.ComponentType<any>;
  validator?: (text: string) => string | undefined;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
};

// ----------------------------- PopoverWrapper -----------------------------
export type PopoverWrapperType = {
  visible: boolean;
  target: React.ReactNode | React.RefObject<React.Component>;
  children: React.ReactNode;
  placement?: PopoverPlacement;
  arrowSize?: { width: number; height: number };
  popoverStyle?: object;
  containerStyle?: object;
  onClose: () => void;
};

// ------------------------------- ModalWrapper -----------------------------
export type ModalWrapperProps = {
  children: React.ReactNode;
  visible?: boolean;
  title?: string;
  animationType?: "none" | "slide" | "fade";
  containerStyle?: object;
  modalContentStyle?: object;
  onClose?: () => void;
};

// -------------------------------- Selection -----------------------------
export type SelectOptionType = {
  id: number;
  label: string;
  type?: string;
};

export type SelectionType = {
  options: SelectOptionType[];
  value?: number;
  label?: string;
  labelStyle?: object;
  onSelect: (id: number) => void;
  placeholder?: string;
  RenderItemCustom?: React.ComponentType<any>;
  RenderAddItemCustom?: React.ComponentType<any>;
  RenderRemoveItemCustom?: React.ComponentType<any>;
};

//-------------------------------- Modal Input Selection -----------------

export type ModalInputSelectionItemType = {
  id: number;
  title: string;
  color?: string;
};

export type ModalInputSelectionType = Omit<InputFieldProps, "value"> & {
  value?: string; // fix for requied of inputField
  options: ModalInputSelectionItemType[];
  valueId?: number;
  label?: string;
  labelStyle?: object;
  placeholder?: string;
  haveAddNew?: boolean;
  haveUnSelect?: boolean;
  containerStyle?: object;
  onSelect: (id: number) => void;
  onGotoDetail?: () => void;
  onUnSelect?: () => void;
  onAddNew?: () => void;
  RenderItemCustom?: React.ComponentType<any>;
};

// ------------------------------- Modal data ---------------------
export type ModalData = {
  title: string;
  animationType: "none" | "slide" | "fade";
  content: React.ComponentType<any>;
  containerStyle?: object;
  contentStyle?: object;
  onClose?: () => void;
};

//---------------------------------- Modal Attachment -----------------

export type ModalAttachmentType = {
  animationType: "none" | "slide" | "fade";
  containerStyle?: object;
};

export type AttachmentsType = {
  uri: string[];
  onPreview?: (uri: string) => void;
  onDelete?: (uri: string) => void;
};

export type AttachmentType = {
  uri: string;
  onPreview?: (uri: string) => void;
  onDelete?: (uri: string) => void;
};

//-------------------------------- Modal Selection -----------------

export type ModalSelectionType = {
  label: string;
  options: ModalInputSelectionItemType[];
  valueId?: number;
  haveAddNew?: boolean;
  haveUnSelect?: boolean;
  onSelect: (id: number) => void;
  onUnSelect?: () => void;
  onAddNew?: () => void;
  RenderItemCustom?: React.ComponentType<any>;
  RenderTarget: React.ComponentType<any>;
};

// -------------------------- Many2ManyTags ------------------------

export type optionMany2manyTags = TagType[] | any[];
export type Many2MnayTagsType = {
  valueIds: number[];
  options: optionMany2manyTags;
  label?: string;
  iconLabel?: string;
  labelStyle?: object;
  containerStyle?: object;
  haveAddNew?: boolean;
  haveUnSelect?: boolean;
  onSelect: (id: number) => void;
  onGotoDetail?: () => void;
  onUnSelect?: (id: number) => void;
  onAddNew?: () => void;
  RenderItemCustom?: React.ComponentType<Many2MnayTagsItemType>;
};

export type Many2MnayTagsItemType = {
  item: TagType;
  selected: number[];
  haveUnSelect?: boolean;
  onSelect?: (id: number) => void;
  onUnSelect?: (id: number) => void;
  onClose?: () => void;
};

// -------------------------- Content list ------------------------

export type ContentListOptionType = {
  id: number;
  title: string;
  color?: string;
};

export type ContentListType = {
  haveSearch?: boolean;
  selected: number[];
  options: ContentListOptionType[];
  haveAddNew?: boolean;
  haveUnSelect?: boolean;
  onSearch?: (value: number) => void;
  onSelect?: (id: number) => void;
  onUnSelect?: () => void;
  onAddNew?: () => void;
  onClose?: () => void;
  RenderItemCustom?:
    | React.ComponentType<RenderItemDefaultProps>
    | React.ComponentType<Many2MnayTagsItemType>;
};

export type RenderItemDefaultProps = {
  item: ModalInputSelectionItemType;
  selected: number[];
  haveUnSelect?: boolean;
  onSelect?: (id: number) => void;
  onUnSelect?: () => void;
  onClose?: () => void;
};

// -------------------------- Priority -----------------------------
export type PriorityType = {
  item: ModalInputSelectionItemType;
  selected: number[];
  onSelect?: (id: number) => void;
  onClose?: () => void;
};

// ----------------------------- ColorPicker -----------------------------
export type ColorPickerType = {
  value: string;
  onSelect: (color: string) => void;
};

// ----------------------------- AttachmentPicker -----------------------------

export type AttachmentPickerType = {
  type?: string;
  multiple?: boolean;
  onSelect: (uri: string[], isMove: boolean) => void;
  RenderItem?: React.ComponentType<any>;
};

export type OptionImageType = {
  onImage: () => void;
  onFolder: () => void;
};

export type RenderCameraType = {
  onSelect: (uri: string) => void;
};

// ------------------------------ DateTimeInput -----------------------------
export type Mode = "date" | "time" | "datetime";

export type UseDatePickerProps = {
  mode?: Mode;
  initialDate?: Date;
  onConfirm?: (dateFormat: string) => void;
  format?: string; // định dạng của moment, ví dụ "DD/MM/YYYY HH:mm"
  maximumDate?: Date;
  minimumDate?: Date;
};

export type DateTimeInputProps = InputFieldProps &
  UseDatePickerProps & { disabled?: boolean };

// ----------------------------- Loading -----------------------------
export type LoadingIconType = {
  size: "verySmall" | "small" | "medium" | "large";
  color?: string;
  containerStyle?: object;
};

// ---------------------------- Search bar ---------------------------
export type SearchBarType = {
  value?: string;
  onSearch?: (value: string) => void;
};

// ----------------------------- User -----------------------------

export type userType = {
  username: string;
  email: string;
  password: string;
};

export type userInfoType = {
  email: string;
  username: string;
  password: string;
  avatar: string;
  coverBackground: string;
  phone: string;
  birthday: string;
  pushNotification: boolean;
  shake: boolean;
};

// ----------------------------- Group -----------------------------

// export const priorityGroup = [
//   { id: 1, title: "Gấp" },
//   { id: 2, title: "Cao" },
//   { id: 3, title: "Bình thường" },
//   { id: 4, title: "Thấp" },
//   { id: 5, title: "Không ưu tiên" },
// ];

// export const colorByPriority = {
//   1: colors.red,
//   2: colors.orange,
//   3: colors.green,
//   4: colors.teal,
//   5: colors.gray,
// };
export type GroupDetailProps = object;
export type PriorityGroupType = 1 | 2 | 3 | 4 | 5;

export type GroupType = {
  id: number;
  title: string;
  content: string;
  priority: PriorityGroupType;
  color: string;
};

export type GroupOptionsType = GroupType & {
  type?: string;
};

export type GroupItemType = {
  item: ModalInputSelectionItemType;
  selected: number[];
  haveUnSelect?: boolean;
  onSelect?: (id: number) => void;
  onUnSelect?: () => void;
  onClose?: () => void;
};

// ---------------------------- Tag -----------------------------

export type TagDetailType = object;
export type TagType = {
  id: number;
  title: string;
  content: string;
  groupId: number;
  color: string;
  onDelete?: (id: number) => void;
};

export type TagCustomType = {
  id: number | string;
  title: string;
  content: string;
  groupId: number;
  groupInfo: GroupType | null;
  color: string;
  type?: string;
};

// ---------------------------- Task -----------------------------
export type TaskType = {
  id: number;
  title: string;
  image?: string;
  hasNotification: boolean;
  hasShake: boolean;
  groupId: number;
  createDate: string;
  startDate: string;
  endDate: string;
  time: string;
  isAlways: number;
  sequence: number;
  tagsId: number[];
  attachments: string[];
  content: string;
};

export type TaskDetailType = TaskType & { group: GroupType } & {
  tags: TagType[];
};

// ------------------------Kanban ------------------------------------
export type KanbanProps = {
  searchText?: string;
  groups: GroupType[];
  tags: TagType[];
};

export type KanbanColumnType = {
  group: GroupType;
  tags: TagType[];
  groups: GroupType[];
  searchText?: string;
  onOpenImage?: (uri: string) => void;
};

export type KanbanItemProps = {
  index?: number;
  task: TaskDetailType;
  groups: GroupType[];
  disabled?: boolean;
  containerCard?: object;
  onPress?: (task: TaskDetailType, index?: number) => void;
  onLongPress?: () => void;
  onSelectGroup: (task: TaskDetailType, newGroupId: number) => void;
  onDelete: (task: TaskDetailType) => void;
  onChangeNotification?: (task: TaskDetailType, value: boolean) => void;
  onChangeShake?: (task: TaskDetailType, value: boolean) => void;
  onOpenImage?: (uri: string) => void;
};

// ----------------------------- Calendar --------------------------------------

export type calendarType = {
  isCurrentTab: boolean;
  searchText?: string;
  groups: GroupType[];
  tags: TagType[];
};

export type calendarComponnetType = {
  selectedDate: string;
  calendarModes: calendarModesType;
  mode: string;
  disableChangeMode?: boolean;
  daysInMonth: string[][];
  events: Record<string, TagDetailType[]>;
  groups: GroupType[];
  maxEventCount: number;
  onChangeMode?: (mode: string) => void;
  onChanegeDate?: (date: string) => void;
};
export type calendarHeaderType = {
  selectedDate: string;
  mode?: string;
  onLayout: ({ nativeEvent }: LayoutChangeEvent) => void;
  onToday: (date: string) => void;
  onCalendarPrev?: () => void;
  onCalendarNext?: () => void;
};

export type calendarNameDays = {
  calendarModes: calendarModesType;
  onLayout: ({ nativeEvent }: LayoutChangeEvent) => void;
};

export type layoutComponentType = {
  container: { height: number; width: number };
  header: { height: number; width: number };
  nameDays: { height: number; width: number };
};

export type calendarModesType = {
  monthFullScreen: {
    height: number;
    width: number;
    dateHeight: number;
  };
  monthHalfScreen: {
    height: number;
    width: number;
    dateHeight: number;
  };
  week: {
    height: number;
    width: number;
    dateHeight: number;
  };
};

export type eventType = {
  task: TaskDetailType;
  index: number;
  maxEventCount: number;
  eventWidth: number;
};

// ----------------------------- Components ----------------------

export type AppLogoType = {
  isEffect?: boolean;
};