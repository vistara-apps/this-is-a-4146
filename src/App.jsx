import React from 'react';
import { AppProvider } from './contexts/AppContext';
import AppShell from './components/AppShell';

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;