import styled from 'styled-components';

export const StyledButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 17px;

  & > button {
    & > svg {
      font-size: 32px;
      color: ${({ theme }) => theme.colors.white_1};
    }
  }
`;
