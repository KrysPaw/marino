import { LoadingOutlined } from '@ant-design/icons';
import { StyledButton, StyledButtonText } from './Button.styled';

type Props = {
	children?: React.ReactNode;
	state?: 'default' | 'disabled' | 'loading';
	minWidth?: string;
	keepSpaceForIcon?: boolean;
	icon?: React.ReactNode;
	onClick?: () => void;
};

export const Button = ({
	children,
	state = 'default',
	minWidth = '0px',
	keepSpaceForIcon = false,
	icon,
	onClick = () => {},
}: Props) => {
	return (
		<StyledButton
			$minWidth={minWidth}
			$state={state}
			onClick={state === 'default' ? onClick : undefined}
		>
			<StyledButtonText
				$displayIcon={keepSpaceForIcon || state === 'loading' || !!icon}
			>
				<div>{state === 'loading' ? <LoadingOutlined /> : icon}</div>
				<div>{children}</div>
			</StyledButtonText>
		</StyledButton>
	);
};
