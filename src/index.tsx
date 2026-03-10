import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { PaymentsProvider } from './contexts/PaymentsContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
        <PaymentsProvider>
            <App />
        </PaymentsProvider>
    </LanguageProvider>
  </React.StrictMode>
);