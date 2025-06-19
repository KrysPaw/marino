import styled from 'styled-components';

export const StyledViewport = styled.div<{ scale: number }>`
  position: absolute;
  transform: scale(${(props) => props.scale});
  width: 1700px;
  height: 960px;
  background: ${({ theme }) => theme.colors.darkBlue_1}66;
  border-radius: 24px;
  padding: 24px;
  -webkit-box-shadow: 0px 0px 40px -12px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 0px 40px -12px rgba(0, 0, 0, 1);
  box-shadow: 0px 0px 40px -12px rgba(0, 0, 0, 1);
  backdrop-filter: blur(8.8px);
`;
