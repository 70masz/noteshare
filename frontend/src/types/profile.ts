import { Folder } from "./folder";

export interface UserProfileResponse {
    username: string;
    createdAt: string;
    folders: Folder[];
    totalNotes: number;
}