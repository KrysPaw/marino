import styled from 'styled-components';

export const StyledContainer = styled.div`
  margin-top: 144px;
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

export const StyledDescription = styled.p`
  user-select: none;
  margin-top: 16px;
  font-size: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.cream};
  text-shadow: 2px 2px 4px rgba(62, 62, 62, 1);
`;

export const StyledNameInputContainer = styled.div`
  margin-top: 36px;
`;

export const StyledButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
`;
