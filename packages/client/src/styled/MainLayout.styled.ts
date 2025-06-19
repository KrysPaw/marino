import styled from "styled-components";

const GLOBAL_PADDING = 24;

export const StyledMainLayout = styled.div`
  display: flex;
  max-width: calc(100vw);
  max-height: calc(100vh);
  height: 100vh;
  background-image: url("src/assets/images/wave_background.png");
  background-repeat: no-repeat;
  background-attachment: fixed; 
  background-size: 100% 100%;
`

export const SidePanel = styled.aside`
  flex: 0 0 160px;
`;

export const StyledPageContent = styled.main`
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${GLOBAL_PADDING}px;
`;