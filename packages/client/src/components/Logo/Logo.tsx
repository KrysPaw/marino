import type React from 'react';
import logo from '../../assets/images/logo.png';
import { LogoContainer, StyledLogo } from './Logo.styled';

export const Logo = (): React.JSX.Element => {
	return (
		<LogoContainer>
			<StyledLogo src={logo} />
			Marino
		</LogoContainer>
	);
};
