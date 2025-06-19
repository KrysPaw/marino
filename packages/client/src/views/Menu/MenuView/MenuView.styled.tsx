import styled from 'styled-components';

export const StyledContainer = styled.div`
  margin-top: 144px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledDescription = styled.p`
  user-select: none;
  margin-top: 16px;
  font-size: 36px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.white_1};
  text-shadow: 2px 2px 4px rgba(62, 62, 62, 1);
`;

export const StyledOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 72px;
  margin-top: 72px;
`;

export const StyledJoinOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
`;
