import React from "react";
import { View } from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  FontAwesome5,
  FontAwesome6,
  Feather,
  Foundation,
  AntDesign,
} from "@expo/vector-icons";

import { IconType } from "../utils/types";
import { useAppContext } from "../useHook/useAppContext";

export function MaterialIconsIcon(props: IconType) {
  const { name, ...rest } = props;
  const { colors } = useAppContext();
  return (
    <View>
      <MaterialIcons
        name={props.name as any}
        color={colors.iconColor}
        {...rest}
      />
    </View>
  );
}

export function FontAwesomeIcon(props: IconType) {
  const { name, ...rest } = props;
  const { colors } = useAppContext();
  return (
    <View>
      <FontAwesome
        name={props.name as any}
        color={colors.iconColor}
        {...rest}
      />
    </View>
  );
}

export function FontAwesome5Icon(props: IconType) {
  const { name, ...rest } = props;
  const { colors } = useAppContext();
  return (
    <View testID="fontAwesome5Icon">
      <FontAwesome5
        name={props.name as any}
        color={colors.iconColor}
        {...rest}
      />
    </View>
  );
}

export function FontAwesome6Icon(props: IconType) {
  const { name, ...rest } = props;
  const { colors } = useAppContext();
  return (
    <View testID="fontAwesome6Icon">
      <FontAwesome6
        name={props.name as any}
        color={colors.iconColor}
        {...rest}
      />
    </View>
  );
}

export function IoniconsIcon(props: IconType) {
  const { name, ...rest } = props;
  const { colors } = useAppContext();
  return (
    <View testID="ioniconsIcon">
      <Ionicons name={props.name as any} color={colors.iconColor} {...rest} />
    </View>
  );
}
export function AntDesignIcon(props: IconType) {
  const { name, ...rest } = props;
  const { colors } = useAppContext();
  return (
    <View testID="antDesignIcon">
      <AntDesign name={props.name as any} color={colors.iconColor} {...rest} />
    </View>
  );
}
export function FeatherIcon(props: IconType) {
  const { name, ...rest } = props;
  const { colors } = useAppContext();
  return (
    <View testID="featherIcon">
      <Feather name={props.name as any} color={colors.iconColor} {...rest} />
    </View>
  );
}

export function FoundationIcon(props: IconType) {
  const { name, ...rest } = props;
  const { colors } = useAppContext();
  return (
    <View testID="foundationIcon">
      <Foundation name={props.name as any} color={colors.iconColor} {...rest} />
    </View>
  );
}