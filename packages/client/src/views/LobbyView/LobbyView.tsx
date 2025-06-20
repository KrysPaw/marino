import { useMemo } from 'react';
import {
	StyledContainer,
	StyledLobbyContainer,
	StyledOtherPartContainer,
	StyledPlayerList,
	StyledPlayerListContainer,
	StyledPlayerListItem,
	StyledPlayerListTitle,
	StyledTitle,
} from './LobbyView.styled';

const PLAYER_LIMIT = 8;

export const LobbyView = (): React.JSX.Element => {
	const playerItems = useMemo(() => {
		// Always make PLAYER_LIMIT sockets but insert players at the beginning
		const players = ['Kris', 'Gadzior']; // This should be replaced with actual player data from state or props

		return Array.from({ length: PLAYER_LIMIT }, (_, index) => {
			const isPlayerPresent = index < players.length;
			const playerName = players[index] || 'Free slot';

			return (
				<StyledPlayerListItem
					key={`1${index + 3}2`}
					inactive={!isPlayerPresent}
				>
					{index + 1}. {playerName}
				</StyledPlayerListItem>
			);
		});
	}, []);

	return (
		<StyledContainer>
			<StyledTitle>Lobby</StyledTitle>
			<StyledLobbyContainer>
				<StyledPlayerListContainer>
					<StyledPlayerListTitle>Players (2/8)</StyledPlayerListTitle>
					<StyledPlayerList>{playerItems}</StyledPlayerList>
				</StyledPlayerListContainer>
				<StyledOtherPartContainer>a</StyledOtherPartContainer>
			</StyledLobbyContainer>
		</StyledContainer>
	);
};
