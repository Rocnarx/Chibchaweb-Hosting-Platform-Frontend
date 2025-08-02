// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './Context/UserContext';
import { ExtensionProvider } from "./Context/ExtensionContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ExtensionProvider> {/* <- aquí */}
          <App />
        </ExtensionProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
