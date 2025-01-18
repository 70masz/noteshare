import { Note } from "../types/note";
import { api } from "./api";

export const getNoteContent = async (noteId: number): Promise<string> => {
    const { data } = await api.get<string>(`/notes/${noteId}/content`);
    return data;
};

export const getNoteDetails = async (noteId: number): Promise<Note> => {
    const { data } = await api.get<Note>(`/notes/${noteId}`);
    return data;
};