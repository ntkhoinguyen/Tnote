import React from "react";
import { Pressable } from "react-native";
import moment from "moment";

import {InputField} from "@/src/components/inputField";
import { useDatePicker } from "@/src/useHook/useDatePicker";
import { DateTimeInputProps } from "../utils/types";

export const DateTimeInput: React.FC<DateTimeInputProps> = (props) => {
  const { open, renderPicker } = useDatePicker({
    mode: props.mode || "date",
    format: props.format || "DD/MM/YYYY HH:mm:ss",
    initialDate: props.value
      ? moment(props.value, props.format || "DD/MM/YYYY HH:mm:ss").toDate()
      : new Date(),
    onConfirm: (date: string) => {
      props?.onChangeText?.(date);
    },
    minimumDate: props.minimumDate,
    maximumDate: props.maximumDate,
  });

  const onPressDate = () => {
    open();
  };

  return (
    <>
      <Pressable
        onPress={onPressDate}
        disabled={props.disabled}
        testID="dateTimeInput"
      >
        <InputField {...props} />
      </Pressable>
      {renderPicker()}
    </>
  );
};


