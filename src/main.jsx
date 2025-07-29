import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import UserContext from './context/usercontext'; // ✅ Default import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContext> {/* ✅ wrap App inside Provider */}
      <App />
    </UserContext>
  </StrictMode>
);
