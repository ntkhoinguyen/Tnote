import { useState } from "react";

import { ModalWrapper } from "@/src/components/modalWrapper";
import { ModalData } from "@/src/utils/types";

export const useModal = (props: ModalData) => {
  const {
    title,
    animationType,
    content: Content,
    containerStyle,
    contentStyle,
    onClose,
  } = props;
  const [visible, setVisible] = useState(false);

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
    onClose?.();
  };

  const RenderModal = () => {
    return (
      <ModalWrapper
        title={title}
        visible={visible}
        onClose={close}
        animationType={animationType}
        containerStyle={containerStyle}
        modalContentStyle={contentStyle}
      >
        {visible ? <Content onClose={close} /> : null}
      </ModalWrapper>
    );
  };

  return { RenderModal, open, close };
};
