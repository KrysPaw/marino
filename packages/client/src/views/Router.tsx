import { createBrowserRouter } from 'react-router';
import { GameView } from './GameView/GameView';
import { MenuView } from './Menu/MenuView/MenuView';
import { AnimatedLayout } from '../components/AnimatedLayout/AnimatedLayout';
import { RequireUser } from './RequireView/RequireUser';
import { Animated } from '../components/AnimatedLayout/Animated';
import { WelcomeView } from './Menu/WelcomeView/WelcomeView';

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
                element: <WelcomeView />,
              },
              {
                path: '/menu',
                errorElement: <div>Error Page</div>,
                element: <MenuView />,
              },
              {
                path: '/lobby',
                errorElement: <div>Error Page</div>,
                element: <GameView />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
