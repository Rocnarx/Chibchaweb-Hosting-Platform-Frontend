import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './Context/UserContext';
import { ExtensionProvider } from "./Context/ExtensionContext";
import { AlertaProvider } from "./Context/AlertaContext"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ExtensionProvider>
          <AlertaProvider>
            <App />
          </AlertaProvider>
        </ExtensionProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
