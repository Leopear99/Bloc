// src/components/AddNoteModal.tsx
import React, { useState } from 'react';
import '../styles/App.css'; // Asegúrate de que esta línea esté presente

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddNote: (note: { id: number; title: string; content: string }) => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, onAddNote }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleAddNote = () => {
        const newNote = {
            id: Date.now(),
            title,
            content,
        };
        onAddNote(newNote);
        setTitle('');
        setContent('');
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal">
                <h3>Agregar Nota</h3>
                <input 
                    type="text" 
                    placeholder="Título" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                />
                <textarea 
                    placeholder="Contenido" 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                />
                <button onClick={handleAddNote}>Guardar</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </>
    );
}

export default AddNoteModal;
