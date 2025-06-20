import { StyledHeader } from './Header.styled';
import { Logo } from '../Logo/Logo';
import { HeaderControls } from '../HeaderControls/HeaderControls';

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
