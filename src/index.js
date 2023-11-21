import React from 'react';
import { createRoot } from 'react-dom/client'; // Corrected import
import Main from './main'; // Corrected import statement

const root = document.getElementById('root');
createRoot(root).render(<Main />);
