import type { ValueOf } from '@shared';
import ReactModal from 'react-modal';
import { ModalSize } from './modal-size';
import {
	StyledModalBody,
	StyledModalContent,
	StyledModalHeader,
} from './Modal.styled';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from '../Button/Button';
import { motion } from 'framer-motion';

type Props = {
	isOpen?: boolean;
	size?: ValueOf<typeof ModalSize>;
	title?: string;
	children?: React.ReactNode;
	onCloseClick?: () => void;
};

export const Modal = ({
	isOpen = false,
	size = ModalSize.SMALL,
	title,
	children,
	onCloseClick = () => {},
}: Props): React.JSX.Element => {
	return (
		<ReactModal
			isOpen={isOpen}
			onRequestClose={onCloseClick}
			shouldCloseOnOverlayClick={false}
			parentSelector={() => document.getElementById('game-view') as HTMLElement}
			style={{
				overlay: {
					backgroundColor: 'rgba(0, 0, 0, 0.1)',
					zIndex: 1000,
					borderRadius: '24px',
					backdropFilter: 'grayscale(30%)',
					transition: 'backdrop-filter 0.3s ease-in-out',
				},
				content: {
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: `${size}px`,
					padding: 'none',
					border: 'none',
					borderRadius: '24px',
					overflow: 'unset',
					background: 'none',
				},
			}}
		>
			<motion.div
				initial={{ opacity: 0, y: -40 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -40 }}
				style={{ maxHeight: '100%' }}
			>
				<StyledModalContent>
					<StyledModalHeader>
						{title ?? <span />}
						<Button onClick={onCloseClick}>
							<CloseOutlined />
						</Button>
					</StyledModalHeader>
					<StyledModalBody>{children}</StyledModalBody>
				</StyledModalContent>
			</motion.div>
		</ReactModal>
	);
};
