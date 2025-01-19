import { Folder } from "../types/folder";
import { Note } from "../types/note";
import { api } from "./api";

export const getFolderDetails = async (folderId: number): Promise<Folder> => {
    const { data } = await api.get<Folder>(`/folders/${folderId}`);
    return data;
};

export const getFolderNotes = async (folderId: number): Promise<Note[]> => {
    const { data } = await api.get<Note[]>(`/folders/${folderId}/notes`);
    return data;
};