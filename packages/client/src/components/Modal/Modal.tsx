import { CloseOutlined } from "@ant-design/icons";
import type { ValueOf } from "@shared";
import { motion } from "framer-motion";
import ReactModal from "react-modal";
import { Button } from "../Button/Button";
import {
  StyledModalBody,
  StyledModalContent,
  StyledModalHeader,
} from "./Modal.styled";
import { ModalSize } from "./modal-size";

type Props = {
  isOpen?: boolean;
  size?: ValueOf<typeof ModalSize>;
  title?: string;
  children?: React.ReactNode;
  closable?: boolean;
  hideHeader?: boolean;
  onCloseClick?: () => void;
};

export const Modal = ({
  isOpen = false,
  size = ModalSize.SMALL,
  title,
  children,
  closable = true,
  hideHeader = false,
  onCloseClick = () => {},
}: Props): React.JSX.Element => {
  return (
    <ReactModal
      appElement={document.getElementById("game-view") as HTMLElement}
      isOpen={isOpen}
      onRequestClose={onCloseClick}
      shouldCloseOnOverlayClick={false}
      parentSelector={() => document.getElementById("game-view") as HTMLElement}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          borderRadius: "24px",
          backdropFilter: "grayscale(30%)",
          transition: "backdrop-filter 0.3s ease-in-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          position: "static",
          width: `${size}px`,
          padding: "none",
          border: "none",
          borderRadius: "24px",
          overflow: "unset",
          background: "none",
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        style={{ maxHeight: "100%" }}
      >
        <StyledModalContent>
          {!hideHeader && (
            <StyledModalHeader>
              {title ?? <span />}
              {closable && (
                <Button onClick={onCloseClick}>
                  <CloseOutlined />
                </Button>
              )}
            </StyledModalHeader>
          )}
          <StyledModalBody>{children}</StyledModalBody>
        </StyledModalContent>
      </motion.div>
    </ReactModal>
  );
};
