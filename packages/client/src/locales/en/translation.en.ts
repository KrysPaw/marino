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
};
