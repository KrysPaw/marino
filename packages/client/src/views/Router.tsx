import { createBrowserRouter } from 'react-router';
import { GameView } from './GameView/GameView';
import { MenuView } from './MenuView/MenuView';
import { AnimatedLayout } from '../components/AnimatedLayout/AnimatedLayout';
import { RequireUser } from './RequireUser/RequireUser';
import { Animated } from '../components/AnimatedLayout/Animated';
import { WelcomeView } from './WelcomeView/WelcomeView';
import { RequireConnection } from './RequireConnection/RequireConnection';
import { NoConnectionErrorView } from './NoConnectionError/NoConnectionErrorView';
import { LobbyView } from './LobbyView/LobbyView';

export const router = createBrowserRouter([
	{
		path: '/',
		errorElement: <div>Error Page</div>,
		element: <AnimatedLayout />,
		children: [
			{
				path: '/',
				errorElement: <div>Error Page</div>,
				element: <Animated />,
				children: [
					{
						path: '/',
						errorElement: <div>Error Page</div>,
						element: <RequireUser />,
						children: [
							{
								path: '/',
								errorElement: <div>Error Page</div>,
								element: <RequireConnection />,
								children: [
									{
										path: '/',
										errorElement: <div>Error Page</div>,
										element: <WelcomeView />,
									},
									{
										path: '/menu',
										errorElement: <div>Error Page</div>,
										element: <MenuView />,
									},
									{
										path: '/lobby/:code',
										errorElement: <div>Error Page</div>,
										element: <LobbyView />,
									},
									{
										path: '/game/:code',
										errorElement: <div>Error Page</div>,
										element: <GameView />,
									},
								],
							},
							{
								path: '/no-connection',
								errorElement: <div>Error Page</div>,
								element: <NoConnectionErrorView />,
							},
						],
					},
				],
			},
		],
	},
]);
