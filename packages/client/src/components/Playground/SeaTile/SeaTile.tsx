import type React from 'react';
import type { Position } from '@shared';

type Props = {
	position: Position;
};

export const SeaTile = ({ position }: Props): React.JSX.Element => {
	return (
		<div
			className="sea-tile"
			style={{
				gridColumn: position.x + 1,
				gridRow: position.y + 1,
				aspectRatio: '1 / 1',

				border: '1px solid #1E90FF',
			}}
		/>
	);
};
