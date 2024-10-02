// src/main.jsx
import React from 'react'; // Importar React
import ReactDOM from 'react-dom/client'; // Importar ReactDOM
import App from './App'; // Importar el componente principal App

// Crear la raíz de la aplicación
const root = ReactDOM.createRoot(document.getElementById('app'));

// Renderizar el componente App dentro de la raíz
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
