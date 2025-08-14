import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import NetInfo from "@react-native-community/netinfo";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { IoniconsIcon } from "@/src/components/icon";

type MessageType = {
  id: string;
  text: string;
  sender: "user" | "gemini";
};

export const ChatAI = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  const [isOnline, setIsOnline] = useState(true);
  const flashListRef = useRef<FlashListRef<MessageType>>(null);

  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected || false);
    });

    // Initial network check
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected || false);
    });

    return () => unsubscribe();
  }, []);

  const callGemini = async (text: string): Promise<string> => {
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyATeDDn4mvIEqqAJ_UDvoWRE3gCUfZOMqc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const responseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      return responseText;
    } catch (error) {
      console.error("Error calling Gemini:", error);
      return "Error fetching response";
    }
  };

  const waitingGemini = async (text: string) => {
    const geminiResponse = await callGemini(text);
    const geminiMessage: MessageType = {
      id: (Date.now() + 1).toString(),
      text: geminiResponse,
      sender: "gemini",
    };
    setMessages((prevMessages) => [
      ...prevMessages.slice(0, -1),
      geminiMessage,
    ]);

    // Scroll to the latest message
    setTimeout(() => {
      flashListRef.current?.scrollToEnd?.({ animated: true });
    }, 100);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !isOnline) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
    };

    const geminiTyping: MessageType = {
      id: (Date.now() + 1).toString(),
      text: t("typing"),
      sender: "gemini",
    };

    setMessages([...messages, userMessage, geminiTyping]);

    setTimeout(() => {
      flashListRef.current?.scrollToEnd?.({ animated: true });
    }, 100);

    waitingGemini(text);
  };

  const renderItem = ({ item }: { item: MessageType }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.geminiMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={sizes.heightHeader}
    >
      <View style={styles.container}>
        {!isOnline && (
          <Text style={styles.offlineText}>{t("noInternetConnection")}</Text>
        )}
        <View style={{ padding: sizes.padding.sm, flex: 1 }}>
          <FlashList
            ref={flashListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flashListContent}
          />
        </View>
        <AskComponent isOnline={isOnline} handleSend={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

type AskComponentType = {
  isOnline: boolean;
  handleSend: (text: string) => void;
};

const AskComponent = (props: AskComponentType) => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const [inputText, setInputText] = useState("");

  const { isOnline } = props;

  const onSend = () => {
    props.handleSend?.(inputText);
    setInputText("");
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder={t("whatDoYouWantToKnow")}
        multiline
        maxLength={500}
        numberOfLines={3}
        placeholderTextColor={colors.placeHolderText}
      />

      <TouchableOpacity
        style={[styles.sendButton, { opacity: isOnline ? 1 : 0.2 }]}
        onPress={onSend}
        disabled={!isOnline}
      >
        <IoniconsIcon name="send" size={24} color={defaultColors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flashListContent: {
      padding: 10,
    },
    messageContainer: {
      marginVertical: 5,
      padding: 10,
      borderRadius: 10,
      maxWidth: "80%",
    },
    userMessage: {
      backgroundColor: colors.userAskBackground,
      alignSelf: "flex-end",
    },
    geminiMessage: {
      backgroundColor: colors.geminiBackground,
      alignSelf: "flex-start",
    },
    messageText: {
      fontSize: size.fontSize.lg,
      color: colors.text,
    },
    inputContainer: {
      flexDirection: "row",
      padding: sizes.padding.sm,
      backgroundColor: colors.background,
      borderTopWidth: sizes.borderWidth.xs,
      borderTopColor: colors.border,
    },
    input: {
      flex: 1,
      borderWidth: sizes.borderWidth.xs,
      borderColor: colors.border,
      borderRadius: sizes.borderRadius.md,
      padding: sizes.padding.sm,
      maxHeight: sizes.heightHeader,
      marginRight: sizes.margin.md,
      color: colors.inputTextColor,
    },
    sendButton: {
      justifyContent: "center",
      opacity: 1,
    },
    offlineText: {
      textAlign: "center",
      color: colors.red,
      backgroundColor: colors.internetWarning,
      fontSize: size.fontSize.md,
      fontWeight: size.fontWeight.medium as "500",
      padding: size.padding.sm,
    },
  });
};

export default ChatAI;
