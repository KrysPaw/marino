import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: flex;
  height: 100%;
  gap: 24px;
`;

export const StyledLeftPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  gap: 24px;
  height: 100%;
`;

export const StyledLeftTopPanel = styled.div`
  display: flex;
  flex: 0 0 100px;
`;

export const StyledMapContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex: 1;
  box-sizing: border-box;
`;

export const StyledCanvasContainer = styled.div`
  aspect-ratio: 1 / 1;
`;

export const StyledController = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const StyledCanvas = styled.canvas`
  height: 100%;
  aspect-ratio: 1 / 1;
`;
