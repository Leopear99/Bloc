// src/components/PanelPrincipal.tsx
import React, { useContext, useState, useEffect } from 'react';
import NotesContext from '../context/NotesContext';
import Note from './Note';
import AddNoteModal from './AddNoteModal';
import NoteContainer from './NoteContainer';
import '../styles/App.css';

const PanelPrincipal: React.FC = () => {
    const { state, dispatch } = useContext(NotesContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [noteContainerIds, setNoteContainerIds] = useState<number[]>([]); // Arreglo para múltiples contenedores
    const [movingNoteId, setMovingNoteId] = useState<number | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleAddNote = (newNote: { id: number; title: string; content: string }) => {
        dispatch({ type: 'ADD_NOTE', payload: newNote });
        setModalOpen(false);
    };

    const handleCreateContainer = () => {
        const newContainerId = Date.now();
        setNoteContainerIds([...noteContainerIds, newContainerId]); // Agrega el nuevo contenedor
        dispatch({ type: 'CREATE_CONTAINER', payload: { containerId: newContainerId, title: "Nuevo Contenedor" } });
    };

    const onMoveNote = (e: React.MouseEvent, noteId: number) => {
        e.preventDefault();
        const note = state.notes.find(n => n.id === noteId);
        if (note) {
            setOffset({ x: e.clientX - note.left, y: e.clientY - note.top });
            setMovingNoteId(noteId);
        }
    };

    const onMouseMove = (e: MouseEvent) => {
        if (movingNoteId) {
            const newLeft = e.clientX - offset.x;
            const newTop = e.clientY - offset.y;
            dispatch({
                type: 'UPDATE_NOTE_POSITION',
                payload: {
                    id: movingNoteId,
                    left: newLeft,
                    top: newTop
                }
            });
        }
    };

    const onMouseUp = () => {
        setMovingNoteId(null);
    };

    useEffect(() => {
        document.body.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseup', onMouseUp);

        return () => {
            document.body.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseup', onMouseUp);
        };
    }, [movingNoteId]);

    return (
        <div>
            <button className="add-note-button" onClick={() => setModalOpen(true)}>Agregar Nota</button>
            <button className="add-container-button" onClick={handleCreateContainer}>Agregar Contenedor</button>
            <AddNoteModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAddNote={handleAddNote} />
            
            {/* Renderiza todos los contenedores */}
            {noteContainerIds.map(containerId => (
                <NoteContainer 
                    key={containerId} 
                    containerId={containerId} 
                />
            ))}

            {/* Renderiza las notas que no están en un contenedor */}
            {state.notes.filter(note => !note.containerId).map(note => (
                <Note 
                    key={note.id} 
                    note={note} 
                    onMove={onMoveNote} 
                />
            ))}
        </div>
    );
}

export default PanelPrincipal;
