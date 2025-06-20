import type React from 'react';
import { useRef } from 'react';
import { Button } from '../Button/Button';
import { ArrowLeftOutlined, GlobalOutlined } from '@ant-design/icons';
import 'flag-icons/css/flag-icons.min.css';
import {
	LanguageModal,
	type LanguageModalRef,
} from '../LanguageModal/LanguageModal';
import { StyledButtonsContainer } from './HeaderControls.styled';
import { useStorage } from 'src/storage/hooks/useStorage';

export const HeaderControls = (): React.JSX.Element => {
	const modalRef = useRef<LanguageModalRef>(null);
	const [state] = useStorage();

	const onLocalizationButtonClick = () => {
		modalRef.current?.open();
	};

	const onBackButtonClick = () => {
		switch (state.general.state) {
			case 'MENU':
				// Handle back button in menu state if needed
				break;
			case 'GAME':
				// Handle back button in game state if needed
				break;
			case 'LOBBY':
				// Handle back button in lobby state if needed
				break;
			default:
				// Default action or no action
				break;
		}
	};

	return (
		<StyledButtonsContainer>
			{state.general.state !== 'MENU' && (
				<Button onClick={onBackButtonClick}>
					<ArrowLeftOutlined style={{ fontSize: '32px' }} />
				</Button>
			)}
			<Button onClick={onLocalizationButtonClick}>
				<GlobalOutlined style={{ fontSize: '32px' }} />
			</Button>
			<LanguageModal ref={modalRef} />
		</StyledButtonsContainer>
	);
};
