import styled from 'styled-components';

export const StyledInput = styled.input<{ $width?: string }>`
  background-color: ${({ theme }) => theme.colors.cream}BF;
  border: none;
  width: ${({ $width }) => $width || '100%'};
  padding: 8px 12px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.darkBlue_1};
  transition: background-color 0.5s ease;
  -webkit-box-shadow: inset 0px 0px 4px 0px rgba(97, 97, 97, 1);
  -moz-box-shadow: inset 0px 0px 4px 0px rgba(97, 97, 97, 1);
  box-shadow: inset 0px 0px 4px 0px rgba(97, 97, 97, 1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.cream};
  }

  &:focus {
    outline: none;
    opacity: 1;
    background-color: ${({ theme }) => theme.colors.cream};

    &::placeholder {
      transition: opacity 0.1s;
      opacity: 0;
    }
  }

  &::placeholder {
    transition: opacity 0.2s ease-in-out;
  }
`;
