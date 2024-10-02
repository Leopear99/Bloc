// src/components/NoteContainer.tsx
import React, { useContext, useState, useEffect } from 'react';
import NotesContext from '../context/NotesContext';
import Note from './Note';

interface NoteContainerProps {
    containerId: number;
}

const NoteContainer: React.FC<NoteContainerProps> = ({ containerId }) => {
    const { state, dispatch } = useContext(NotesContext);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ left: 100, top: 100 });
    const [title, setTitle] = useState("Título del Grupo");
    const [isEditing, setIsEditing] = useState(false);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target.tagName !== 'INPUT') {
            e.preventDefault();
            setIsDragging(true);
            setOffset({ x: e.clientX - position.left, y: e.clientY - position.top });
        }
    };

    const onMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newLeft = e.clientX - offset.x;
            const newTop = e.clientY - offset.y;
            setPosition({ left: newLeft, top: newTop });
        }
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const noteId = parseInt(e.dataTransfer.getData("text/plain"), 10); // Obtener ID de la nota arrastrada
        dispatch({
            type: 'ADD_NOTE_TO_CONTAINER',
            payload: { noteId, containerId } // Despachar la acción para agregar la nota al contenedor
        });
    };

    const handleSaveTitle = () => {
        dispatch({
            type: 'UPDATE_CONTAINER_TITLE',
            payload: { id: containerId, title }
        });
        setIsEditing(false);
    };

    const handleDeleteContainer = () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este contenedor?")) {
            dispatch({
                type: 'DELETE_CONTAINER',
                payload: { id: containerId }
            });
        }
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging]);

    return (
        <div 
            className="note-container2" 
            style={{ 
                position: 'absolute',
                left: position.left, 
                top: position.top, 
                border: '1px solid #ccc', 
                borderRadius: '8px', 
                padding: '5px', 
                margin: '10px', 
                backgroundColor: '#f7f7f7', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '5px',
                minHeight: '100px', 
                maxHeight: '200px', 
                overflowY: 'auto', 
                cursor: 'move', 
                userSelect: 'none' 
            }}
            onMouseDown={onMouseDown}
            onDrop={handleDrop} 
            onDragOver={(e) => e.preventDefault()} 
        >
            {isEditing ? (
                <div>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        style={{ width: '100%', marginBottom: '5px' }} 
                    />
                    <button onClick={handleSaveTitle}>Guardar Título</button>
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <h4>{title}</h4>
                    <button onClick={() => setIsEditing(true)}>Editar Título</button>
                    <button onClick={handleDeleteContainer} style={{ marginLeft: '10px' }}>Eliminar Contenedor</button>
                    <p>Notas en este grupo: {state.containers.find(c => c.id === containerId)?.noteIds.length || 0}</p>
                </div>
            )}
            {state.containers.find(container => container.id === containerId)?.noteIds.map(noteId => {
                const note = state.notes.find(note => note.id === noteId);
                return note ? (
                    <Note key={note.id} note={note} />
                ) : null;
            })}
        </div>
    );
}

export default NoteContainer;
