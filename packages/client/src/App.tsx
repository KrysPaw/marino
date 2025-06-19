import {
  SidePanel,
  StyledMainLayout,
  StyledPageContent,
} from './styled/MainLayout.styled';
import { ThemeProvider } from 'styled-components';
import { theme } from './config/theme';
import { Viewport } from './views/Viewport/Viewport';
import { RouterProvider } from 'react-router';
import { router } from './views/Router';
import { Header } from './components/Header/Header';
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyledMainLayout>
        <SidePanel />
        <StyledPageContent>
          <Viewport>
            <Header />
            <RouterProvider router={router} />
          </Viewport>
        </StyledPageContent>
      </StyledMainLayout>
    </ThemeProvider>
  );
};

export default App;
