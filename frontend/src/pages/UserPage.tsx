import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../services/userService";
import { FolderGrid } from "../components/userpage/FolderGrid";

export const UserPage = () => {
    const { username } = useParams();

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['profile', username],
        queryFn: () => getUserProfile(username!),
        enabled: !!username
    });

    if (isLoading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">Error loading profile</div>;
    if (!profile) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-bold mb-4">{profile.username}'s Profile</h1>
                <div className="text-gray-600">
                    <p>Member since: {new Date(profile.createdAt).toLocaleDateString()}</p>
                    <p>Total notes: {profile.totalNotes}</p>
                </div>
            </div>

            <FolderGrid folders={profile.folders} />
        </div>
    );
};