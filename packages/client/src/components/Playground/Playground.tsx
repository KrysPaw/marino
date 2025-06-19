import React from 'react';
import {
  StyledCanvasContainer,
  StyledContainer,
  StyledController,
  StyledLeftPanelContainer,
  StyledLeftTopPanel,
  StyledMapContainer,
} from './Playground.styled';
import { CanvasApp } from '../../canvas/canvas-app';

type Props = {};

export const Playground = ({}: Props): React.JSX.Element => {
  return (
    <StyledContainer>
      <StyledLeftPanelContainer>
        <StyledLeftTopPanel></StyledLeftTopPanel>
        <StyledMapContainer>
          <StyledCanvasContainer>
            <CanvasApp />
          </StyledCanvasContainer>
        </StyledMapContainer>
      </StyledLeftPanelContainer>
      <StyledController></StyledController>
    </StyledContainer>
  );
};
