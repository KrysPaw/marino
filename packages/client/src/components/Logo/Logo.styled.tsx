import styled from 'styled-components';

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white_1};
  user-select: none;
`;

export const StyledLogo = styled.img`
  -webkit-user-drag: none;
  width: 80px;
  height: auto;
`;
