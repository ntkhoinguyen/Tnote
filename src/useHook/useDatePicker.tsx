import { useState } from "react";
import { Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import { UseDatePickerProps } from "../utils/types";

export const useDatePicker = ({
  mode = "date",
  initialDate = new Date(),
  onConfirm,
  format = "DD/MM/YYYY",
  maximumDate,
  minimumDate,
}: UseDatePickerProps) => {
  const [date, setDate] = useState<Date>(initialDate);
  const [isVisible, setIsVisible] = useState(false);

  const open = () => setIsVisible(true);
  const close = () => setIsVisible(false);

  const handleChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    try {
      if (e.type === "set" && selectedDate) {
        setDate(selectedDate);
        onConfirm?.(moment(selectedDate).format(format));
      }
      close();
    } catch (error) {
      console.log(error);
      close();
    }
  };

  const renderPicker = () => {
    if (!isVisible) return null;
    return (
      <DateTimePicker
        testID="dateTimePicker"
        mode={mode}
        display={Platform.OS === "ios" ? "spinner" : "default"}
        value={date}
        onChange={handleChange}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    );
  };

  return {
    date,
    isVisible,
    open,
    close,
    renderPicker,
  };
};
