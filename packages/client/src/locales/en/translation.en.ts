import type { Translation } from '../translation.type';

export const en: Translation = {
	header: {
		logo: 'Marino',
	},
	language: {
		title: 'Language',
		options: {
			en: 'English',
			pl: 'Polski',
		},
	},
	welcome: {
		title: 'Hello there!',
		description:
			'If you want to play the ship game, please enter your nickname',
		namePlaceholder: 'Nickname',
		button: {
			continue: 'Continue',
			learnMore: 'What is this game about?',
		},
	},
	menu: {
		description: 'Do you want to create a game or join your friends?',
		buttons: {
			createGame: 'Create game',
			joinGame: 'Join',
		},
		gameCodePlaceholder: 'Game code',
	},
	noConnection: {
		title: 'Connection error',
		reconnectButton: 'Reconnect',
	},
	sessionAlreadyActive: {
		title: 'Connection error',
		description: 'It seems that you already have an active session.',
		tryAgainButton: 'Try again',
	},
	kickedFromLobby: {
		title: 'You have been kicked from the lobby',
		description: 'You have been kicked from the lobby by the host.',
		returnToMenuButton: 'Return to menu',
	},
	lobby: {
		title: 'Lobby',
		players: 'Players',
		blueTeam: 'Blue team',
		redTeam: 'Red team',
	},
	exceptions: {
		SESSION_ALREADY_ACTIVE: {
			title: 'Session already active',
			description: 'It seems that you already have an active session.',
			actionButton: 'Return to menu',
		},
		NO_CONNECTION: {
			title: 'Connection error',
			actionButton: 'Reconnect',
		},
		KICKED_FROM_LOBBY: {
			title: 'Kicked from the lobby',
			description: 'You have been kicked from the lobby by the host.',
			actionButton: 'Return to menu',
		},
	},
};
