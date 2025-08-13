import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { View } from "react-native";

export type PopoverData = {
  targetRef: any;
  content: ReactNode;
  isParentWidth?: boolean;
};

export const usePopover = () => {
  const [visible, setVisible] = useState(false);
  const [target, setTarget] = useState<any>(null);
  const [content, setContent] = useState<ReactNode>(null);
  const [containerStyle, setContainerStyle] = useState<object>({});

  useEffect(() => {
    return () => {
      setTarget(null);
      setContent(null);
      setVisible(false);
    };
  }, []);

  const open = ({ targetRef, content, isParentWidth }: PopoverData) => {
    try {
      if (!targetRef.current) {
        return;
      }
      else{
        if (isParentWidth) {
          targetRef?.current?.measure?.(
            (x: number, y: number, width: number, height: number) => {
              setContainerStyle({
                width: width || "100%",
              });
            }
          );
        }
        setTarget(targetRef);
        setContent(content);
        setVisible(true);
      }
    } catch (error) {
      console.log("usePopover -----open: ", error);
    }
  };
  
  const close = () => {
    setContent(<View style={{ height: 1, width:1 }} />);
    setVisible(false);
  };

  return {
    visible,
    target,
    content,
    containerStyle,
    open,
    close,
  };
};
