import styled, { css } from "styled-components";

export const StyledContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledTitle = styled.h1`
  user-select: none;
  font-size: 72px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white_1};
  text-shadow: 2px 2px 4px rgba(62, 62, 62, 1);
`;

export const StyledLobbyContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  padding: 72px 144px 0px 144px;
`;

export const StyledPlayerListTitle = styled.h2`
  user-select: none;
  font-size: 36px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white_1};
  text-shadow: 2px 2px 4px rgba(62, 62, 62, 1);
`;

export const StyledPlayerListContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 72px;
  align-items: center;
  width: 100%;
`;

export const StyledPlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 400px;
  margin-top: 24px;
`;

export const StyledPlayerListItem = styled.div<{ $inactive?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  height: 48px;
  background-color: ${({ theme }) => theme.colors.darkBlue_1};
  font-size: 24px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white_1};

  ${({ $inactive, theme }) => {
    if ($inactive) {
      return css`
        opacity: 0.5;
        color: ${theme.colors.gray_1};
      `;
    }

    return "";
  }}
`;

export const StyledOtherPartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`;
