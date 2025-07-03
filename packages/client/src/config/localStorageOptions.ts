import type useLocalStorage from 'use-local-storage';

export const localStorageOptions: Parameters<typeof useLocalStorage>[2] = {
	parser: (value) => value,
	serializer: (value) => (typeof value === 'string' ? value : ''),
};
