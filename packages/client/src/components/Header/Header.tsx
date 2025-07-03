import { HeaderControls } from '../HeaderControls/HeaderControls';
import { Logo } from '../Logo/Logo';
import { StyledHeader } from './Header.styled';

export const Header = () => {
	return (
		<>
			<StyledHeader>
				<Logo />
				<HeaderControls />
			</StyledHeader>
		</>
	);
};
