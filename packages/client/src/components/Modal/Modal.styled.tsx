import styled from 'styled-components';

export const StyledModalHeader = styled.div`
  position: relative;
  padding: 24px;
  min-height: 74px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: ${({ theme }) => theme.colors.white_1};
  font-size: 24px;
`;

export const StyledModalBody = styled.div`
  height: 100%;
  padding: 24px;
  padding-top: 0;
  color: ${({ theme }) => theme.colors.white_1};
`;

export const StyledModalContent = styled.div`
  background: radial-gradient(
    ellipse at right top,
    #102433dd 0%,
    #213555ff 100%
  );
  backdrop-filter: blur(8.8px);
  border-radius: 24px;
  height: 100%;
  -webkit-box-shadow: 0px 0px 40px -12px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 0px 40px -12px rgba(0, 0, 0, 1);
  box-shadow: 0px 0px 40px -12px rgba(0, 0, 0, 1);
`;
