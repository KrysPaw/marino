import type { ChangeEventHandler } from 'react';
import { StyledInput } from './Input.styled';

type Props = {
	value?: string;
	placeholder?: string;
	width?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const Input = ({
	value,
	placeholder,
	width = '100%',
	onChange,
}: Props): React.JSX.Element => {
	return (
		<StyledInput
			autoComplete="off"
			spellCheck={false}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			$width={width}
		/>
	);
};
