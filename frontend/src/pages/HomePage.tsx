import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getLatestPublicNotes } from "../services/noteService";
import { useAuthContext } from "../hooks/auth/useAuthContext";

export const HomePage = () => {
    const { user } = useAuthContext();
    const { data: notes, isLoading, error } = useQuery({
        queryKey: ['latest-notes'],
        queryFn: getLatestPublicNotes
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading notes</div>;
    if (!notes) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">Welcome to Noteshare</h1>
                <p className="text-gray-600 mb-6">
                    Unleash your knowledge and connect with curious minds through collaborative note-sharing.
                    Whether you're a student sharing study materials, a professional documenting best practices,
                    or a lifelong learner exploring new subjects, Noteshare provides a platform to organize,
                    share, and discover notes that matter. Join our community and turn your insights into
                    shared wisdom.
                </p>
                {!user && (
                    <Link 
                        to="/register" 
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </Link>
                )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Latest Public Notes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map(note => (
                        <Link 
                            to={user ? `/note/${note.id}` : "/login"} 
                            key={note.id} 
                            className="border rounded p-4 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Note #{note.id}</span>
                            </div>
                            <p className="text-sm text-gray-600">By {note.username}</p>
                        </Link>
                    ))}
                </div>
                {notes.length === 0 && (
                    <p className="text-gray-500 text-center">No public notes found</p>
                )}
            </div>
        </div>
    );
};