
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress React Router v7 warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) {
    return; // Suppress React Router warnings
  }
  originalWarn.apply(console, args);
};

console.log('🚀 React Router warning suppression enabled');

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(<App />);
