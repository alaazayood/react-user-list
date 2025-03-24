import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 1. إنشاء جذر التطبيق
const container = document.getElementById('root');
const root = createRoot(container);

// 2. عرض التطبيق
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);