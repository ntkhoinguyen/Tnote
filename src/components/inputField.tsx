// components/InputField.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { InputFieldProps } from "@/src/utils/types";

import { FontAwesomeIcon, IoniconsIcon } from "@/src/components/icon";

export const InputField: React.FC<InputFieldProps> = (props) => {
  const {
    ref,
    label = "",
    value = "",
    errorText,
    required,
    labelIcon,
    type = "default",
    borderType = "default",
    placeholder = "",
    editable = true,
    multiline = false,
    RightSection,
    LeftSection,
    containerStyle = {},
    inputStyle = {},
    labelStyle = {},
    validator,
    onChangeText,
    onFocus,
    onBlur,
    onPress,
    ...rest
  } = props;

  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(errorText);
  const [inputHeight, setInputHeight] = useState<number | undefined>(undefined);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const inputRefEdit = useRef<any>(null);

  const handleChange = (text: string) => {
    onChangeText?.(text);
  };

  const onBlurInput = () => {
    setIsFocus(false);
    onBlur?.();
    if (validator) {
      setError(validator(value));
    }
  };

  const onFocusInput = () => {
    onFocus?.();
    if (error) {
      setError(undefined);
    }
    setIsFocus(true);
  };

  const onPressInput = () => {
    onPress?.();
  };

  const onshowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onContentSizeChange = (e: any) => {
    if (multiline) {
      if (e.nativeEvent.contentSize.height > sizes.fontSize.md * 3) {
        setInputHeight(e.nativeEvent.contentSize.height);
      }
    }
  };

  useEffect(() => {
    setError(errorText);
  }, [errorText]);

  const isPassword = type === "password";
  const shouldSecure = isPassword && !showPassword;

  const handleKeyboardHide = () => {
    if (isFocus) {
      if (inputRefEdit?.current?.blur) {
        inputRefEdit?.current?.blur();
      } else if (validator) {
        setError(validator(value));
        inputRefEdit?.current?.blur?.();
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
  }, [isFocus, value]);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* lable */}
      {label.trim() !== "" ? (
        <Text testID="inputLabel" style={[styles.label, labelStyle]}>
          {labelIcon ? (
            <View style={styles.labelIcon}>
              <FontAwesomeIcon name={labelIcon as any} size={14} />
            </View>
          ) : null}
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      {/* input */}
      <View style={styles.inputWrapper}>
        {LeftSection ? (
          <View
            style={[
              styles.leftSection,
              {
                left:
                  borderType === "under" ? sizes.margin.xs : sizes.margin.sm,
              },
            ]}
          >
            <LeftSection />
          </View>
        ) : null}

        <Pressable onPress={onPressInput} disabled={!editable}>
          <TextInput
            ref={ref || inputRefEdit}
            testID="inputField"
            {...rest}
            placeholder={placeholder}
            editable={editable}
            value={value}
            multiline={multiline}
            textAlignVertical="top"
            onChangeText={handleChange}
            onBlur={onBlurInput}
            secureTextEntry={shouldSecure}
            onContentSizeChange={onContentSizeChange}
            placeholderTextColor={colors.placeHolderText}
            style={[
              styles.input,
              error && styles.inputError,
              borderType === "under" && styles.inputUnderline,
              borderType === "none" && styles.inputNoBorder,
              multiline && { height: inputHeight },
              inputStyle,
            ]}
            onFocus={onFocusInput}
          />
        </Pressable>

        {isPassword ? (
          <TouchableOpacity
            testID="buttonShowPassword"
            style={[
              styles.rightSection,
              {
                right:
                  borderType === "under" ? sizes.margin.xs : sizes.margin.sm,
              },
            ]}
            onPress={onshowPassword}
          >
            <IoniconsIcon
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={colors.gray}
            />
          </TouchableOpacity>
        ) : null}

        {RightSection ? (
          <View
            style={[
              styles.rightSection,
              {
                right:
                  borderType === "under" ? sizes.margin.xs : sizes.margin.sm,
              },
            ]}
          >
            <RightSection />
          </View>
        ) : null}
      </View>
      {error !== undefined ? (
        <Text testID="inputError" style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: { width: "100%" },
    label: {
      fontSize: size.fontSize.lg,
      color: colors.label,
      marginBottom: size.margin.sm,
      fontWeight: size.fontWeight.medium as "500",
    },
    labelIcon: {
      paddingRight: size.padding.sm,
    },
    required: { color: colors.error },
    inputWrapper: {
      position: "relative",
      justifyContent: "center",
    },
    input: {
      borderWidth: size.borderWidth.xs,
      borderColor: colors.border,
      padding: size.padding.sm,
      borderRadius: size.borderRadius.sm,
      paddingRight: size.padding.xl * 2, // chừa chỗ icon
      fontSize: size.fontSize.md,
      color: colors.inputTextColor,
    },
    inputError: {
      borderColor: colors.error,
    },
    inputUnderline: {
      borderWidth: 0,
      borderBottomWidth: size.borderWidth.xs,
      borderRadius: 0,
    },
    inputNoBorder: {
      borderWidth: 0,
    },
    leftSection: {
      position: "absolute",
      left: size.padding.sm,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    rightSection: {
      position: "absolute",
      right: size.padding.sm,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      color: colors.error,
      marginTop: 4,
      fontSize: size.fontSize.sm,
    },
  });
