/**
 * Generates a random 6 character game code consisting of uppercase letters and digits.
 * @returns string - A random game code.
 * @example A5D3F9
 */
export const generateGameCode = (): string => {
	// Use cryptographic random values for better randomness
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let gameCode = '';

	for (let i = 0; i < 6; i++) {
		const randomIndex = Math.floor(
			(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) *
				characters.length,
		);
		gameCode += characters[randomIndex];
	}

	return gameCode;
};
