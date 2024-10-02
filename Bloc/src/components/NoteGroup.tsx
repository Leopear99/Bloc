// src/components/NoteGroup.tsx
import React, { useContext } from 'react';
import NotesContext from '../context/NotesContext';
import Note from './Note';

interface NoteGroupProps {
    group: {
        id: number;
        noteIds: number[];
        title: string;
    };
}

const NoteGroup: React.FC<NoteGroupProps> = ({ group }) => {
    const { state } = useContext(NotesContext);

    return (
        <div 
            className="note-group" 
            style={{ 
                position: 'absolute', 
                left: 100, // Reemplaza con la lógica de posición
                top: 100, // Reemplaza con la lógica de posición
                backgroundColor: '#f0f0f0', 
                borderRadius: '8px', 
                border: '1px solid #ccc',
                padding: '10px',
                width: '250px',
            }}
        >
            <h4 style={{ textAlign: 'center' }}>{group.title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {group.noteIds.map(noteId => {
                    const note = state.notes.find(note => note.id === noteId);
                    return note ? (
                        <Note 
                            key={note.id} 
                            note={note} 
                        />
                    ) : null;
                })}
            </div>
        </div>
    );
}

export default NoteGroup;
