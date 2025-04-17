import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';

// Make sure we're using default export
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};

// Ensure this is explicitly exported as default
export default AppRouter;
