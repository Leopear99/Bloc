// src/App.jsx
import React from 'react';
import './styles/App.css'; // Asegúrate de que esta línea esté presente
import PanelPrincipal from './components/PanelPrincipal';
import { NotesProvider } from './context/NotesContext';

// Componente principal de la aplicación
function App() {
    return (
        <NotesProvider>
            <div className="app-container">
                <div className="app-bar"> {/* Agregar una clase para el AppBar */}
                    <h1>Bloc de Notas</h1>
                    <h2>Bienvenido a tu aplicación de notas</h2> {/* Subtítulo */}
                </div>
                <PanelPrincipal />
            </div>
        </NotesProvider>
    );
}

export default App;
