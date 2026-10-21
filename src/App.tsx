import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MobileContainer } from './components/layout/MobileContainer';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MobileContainer>
          <AppRoutes />
        </MobileContainer>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
