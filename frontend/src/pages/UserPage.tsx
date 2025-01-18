import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../services/userService";

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

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Folders</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.folders.map(folder => (
                        <div key={folder.id} className="border rounded p-4 hover:shadow-md transition">
                            <h3 className="font-medium">{folder.name}</h3>
                        </div>
                    ))}
                </div>
                {profile.folders.length === 0 && (
                    <p className="text-gray-500 text-center">No folders found</p>
                )}
            </div>
        </div>
    );
};