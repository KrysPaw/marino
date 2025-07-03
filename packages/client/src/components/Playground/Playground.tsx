import type React from 'react';
import { CanvasApp } from '../../canvas/canvas-app';
import {
	StyledCanvasContainer,
	StyledContainer,
	StyledController,
	StyledLeftPanelContainer,
	StyledLeftTopPanel,
	StyledMapContainer,
} from './Playground.styled';

export const Playground = (): React.JSX.Element => {
	return (
		<StyledContainer>
			<StyledLeftPanelContainer>
				<StyledLeftTopPanel />
				<StyledMapContainer>
					<StyledCanvasContainer>
						<CanvasApp />
					</StyledCanvasContainer>
				</StyledMapContainer>
			</StyledLeftPanelContainer>
			<StyledController />
		</StyledContainer>
	);
};
