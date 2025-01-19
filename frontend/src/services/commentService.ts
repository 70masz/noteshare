import { CommentResponse, CommentRequest } from "../types/comment";
import { api } from "./api";

export const getComments = async (noteId: number): Promise<CommentResponse[]> => {
    const { data } = await api.get<CommentResponse[]>(`/notes/${noteId}/comments`);
    return data;
};

export const createComment = async (noteId: number, comment: CommentRequest): Promise<CommentResponse> => {
    const { data } = await api.post<CommentResponse>(`/notes/${noteId}/comments`, comment);
    return data;
};