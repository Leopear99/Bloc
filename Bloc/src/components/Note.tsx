// src/components/Note.tsx
import React, { useContext, useState, useEffect } from 'react';
import NotesContext from '../context/NotesContext';

interface NoteProps {
    note: {
        id: number;
        title: string;
        content: string;
        left: number;
        top: number;
    };
}

const Note: React.FC<NoteProps> = ({ note }) => {
    const { dispatch } = useContext(NotesContext);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(note.content);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isEditing) {
            e.preventDefault();
            setIsDragging(true);
            setOffset({ x: e.clientX - note.left, y: e.clientY - note.top });
        }
    };

    const onMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newLeft = e.clientX - offset.x;
            const newTop = e.clientY - offset.y;

            dispatch({
                type: 'UPDATE_NOTE_POSITION',
                payload: {
                    id: note.id,
                    left: newLeft,
                    top: newTop,
                },
            });
        }
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const handleSave = () => {
        dispatch({
            type: 'UPDATE_NOTE_CONTENT',
            payload: { id: note.id, content: newContent }
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta nota?")) {
            dispatch({
                type: 'DELETE_NOTE',
                payload: { id: note.id }
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
            className="note"
            style={{
                position: 'absolute',
                left: note.left,
                top: note.top,
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: '#ffeaa7',
                cursor: isEditing ? 'default' : 'move',
                userSelect: 'none',
            }}
            onMouseDown={onMouseDown}
        >
            {isEditing ? (
                <div>
                    <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        style={{ width: '100%', height: '50px' }}
                    />
                    <button onClick={handleSave}>Guardar</button>
                </div>
            ) : (
                <div>
                    <h4 style={{ margin: 0 }}>{note.title}</h4>
                    <p>{note.content}</p>
                    <button onClick={() => {
                        setNewContent(note.content);
                        setIsEditing(true);
                    }}>Editar Nota</button>
                    <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Eliminar</button>
                </div>
            )}
        </div>
    );
}

export default Note;
