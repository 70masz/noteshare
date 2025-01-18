import { UserProfileResponse } from "../types/profile";
import { api } from "./api";

export const getUserProfile = async (username: string): Promise<UserProfileResponse> => {
    const { data } = await api.get<UserProfileResponse>(`/users/${username}/profile`);
    return data;
};