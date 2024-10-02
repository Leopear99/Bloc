// src/context/NotesContext.tsx
import React, { createContext, useReducer, ReactNode } from 'react';

interface Note {
    id: number;
    title: string;
    content: string;
    left: number;
    top: number;
    containerId: number | null; // Almacena el ID del contenedor al que pertenece
}

interface Container {
    id: number;
    noteIds: number[]; // IDs de notas en este contenedor
    title: string; // Título del contenedor
}

interface State {
    notes: Note[];
    containers: Container[];
}

interface Action {
    type: string;
    payload: any;
}

const NotesContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
}>({ state: { notes: [], containers: [] }, dispatch: () => null });

const initialState: State = {
    notes: [],
    containers: []
};

const notesReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_NOTE':
            return {
                ...state,
                notes: [
                    ...state.notes,
                    {
                        id: Date.now(), // Genera un ID único basado en el tiempo
                        title: action.payload.title,
                        content: action.payload.content,
                        left: 100,
                        top: 100,
                        containerId: null // Inicialmente no pertenece a ningún contenedor
                    },
                ],
            };

        case 'UPDATE_NOTE_POSITION':
            return {
                ...state,
                notes: state.notes.map(note =>
                    note.id === action.payload.id
                        ? { ...note, left: action.payload.left, top: action.payload.top }
                        : note
                ),
            };

        case 'UPDATE_NOTE_CONTENT':
            return {
                ...state,
                notes: state.notes.map(note =>
                    note.id === action.payload.id
                        ? { ...note, content: action.payload.content }
                        : note
                ),
            };

        case 'CREATE_CONTAINER':
            return {
                ...state,
                containers: [
                    ...state.containers,
                    {
                        id: action.payload.containerId,
                        noteIds: [],
                        title: action.payload.title, // Se asigna el título al contenedor
                    }
                ]
            };

        case 'ADD_NOTE_TO_CONTAINER':
            return {
                ...state,
                notes: state.notes.map(note =>
                    note.id === action.payload.noteId
                        ? { ...note, containerId: action.payload.containerId } // Asocia la nota al contenedor
                        : note
                ),
                containers: state.containers.map(container =>
                    container.id === action.payload.containerId
                        ? { ...container, noteIds: [...container.noteIds, action.payload.noteId] } // Agrega el ID de la nota al contenedor
                        : container
                )
            };

        case 'UPDATE_CONTAINER_TITLE':
            return {
                ...state,
                containers: state.containers.map(container =>
                    container.id === action.payload.id
                        ? { ...container, title: action.payload.title } // Actualiza el título del contenedor
                        : container
                ),
            };
            case 'DELETE_NOTE':
                return {
                    ...state,
                    notes: state.notes.filter(note => note.id !== action.payload.id), // Filtra la nota eliminada
                    containers: state.containers.map(container => ({
                        ...container,
                        noteIds: container.noteIds.filter(id => id !== action.payload.id), // Elimina la nota del contenedor si existe
                    })),
                };
            case 'DELETE_CONTAINER':
                return {
                    ...state,
                    containers: state.containers.filter(container => container.id !== action.payload.id),
                    notes: state.notes.map(note =>
                        note.containerId === action.payload.id
                            ? { ...note, containerId: null }
                            : note
                    ),
                };

        default:
            return state;
    }
};

export const NotesProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(notesReducer, initialState);

    return (
        <NotesContext.Provider value={{ state, dispatch }}>
            {children}
        </NotesContext.Provider>
    );
};

export default NotesContext;
