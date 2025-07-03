import type { Translation } from '../translation.type';

export const pl: Translation = {
	header: {
		logo: 'Marino',
	},
	language: {
		title: 'Język',
		options: {
			en: 'English',
			pl: 'Polski',
		},
	},
	welcome: {
		title: 'Witajcie!',
		description: 'Jeśli chcesz zagrać w statki, podaj swój pseudonim',
		namePlaceholder: 'Pseudonim',
		button: {
			continue: 'Kontynuuj',
			learnMore: 'O czym jest ta gra?',
		},
	},
	menu: {
		description: 'Chcesz utworzyć grę czy dołączyć do znajomych?',
		buttons: {
			createGame: 'Utwórz grę',
			joinGame: 'Dołącz',
		},
		gameCodePlaceholder: 'Kod gry',
	},
	noConnection: {
		title: 'Brak połączenia',
		reconnectButton: 'Spróbuj ponownie',
	},
	sessionAlreadyActive: {
		title: 'Błąd połączenia',
		description: 'Wydaje się, że masz już aktywną sesję.',
		tryAgainButton: 'Spróbuj ponownie',
	},
	lobby: {
		title: 'Poczekalnia',
		players: 'Gracze',
		blueTeam: 'Drużyna niebieska',
		redTeam: 'Drużyna czerwona',
	},
};
