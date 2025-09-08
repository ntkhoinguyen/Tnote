import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Animated, Easing } from "react-native";
import { SwitchButtonType } from "@/src/utils/types";

export const SwitchButton: React.FC<SwitchButtonType> = (props) => {
  const { LeftIcon, RightIcon, value, toggleSwitch } = props;

  const [isLeft, setIsLeft] = useState(value);
  const anim = useRef(new Animated.Value(value ? 0 : 1)).current;

  useEffect(() => {
    if (value! === isLeft) {
      setIsLeft(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSwitch = () => {
    Animated.timing(anim, {
      toValue: !isLeft ? 0 : 1, // 0 = light, 1 = dark
      duration: 200,
      easing: Easing.out(Easing.circle),
      useNativeDriver: false,
    }).start();
    setIsLeft(!isLeft);
    setTimeout(() => {
      toggleSwitch();
    }, 200);
  };

  // icon position
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 32], // vị trí trái → phải
  });

  // background color
  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#eee", "#333"],
  });

  return (
    <Pressable onPress={handleSwitch}>
      <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
        <Animated.View style={[styles.circle, { transform: [{ translateX }] }]}>
          {isLeft ? <LeftIcon /> : <RightIcon />}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 32,
    borderRadius: 20,
    justifyContent: "center",
    padding: 2,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    elevation: 2, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});
