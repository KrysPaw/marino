import type React from 'react';
import { LogoContainer, StyledLogo } from './Logo.styled';
import logo from '../../assets/images/logo.png';

export const Logo = (): React.JSX.Element => {
  return (
    <LogoContainer>
      <StyledLogo src={logo} />
      Marino
    </LogoContainer>
  );
};
