import styled from "styled-components";

export const CenteredRow = styled.div<{ gap?: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ gap }) => (gap ? `${gap}px` : "0")};
`