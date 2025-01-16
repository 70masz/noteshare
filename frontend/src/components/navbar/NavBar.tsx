import { useAuth } from "../../hooks/auth/useAuth";
import { NavbarProps } from "../../types/props/navbarprops";

export const NavBar = ({ user }: NavbarProps) => {

    const { logout } = useAuth();

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Noteshare</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user.username}</span>
                    <button
                    onClick={() => logout()}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                    >
                    Logout
                    </button>
                </div>
            </div>
        </header>
    );
};