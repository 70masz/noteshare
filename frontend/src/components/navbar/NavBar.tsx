import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { NavbarProps } from "../../types/props/navbarprops";

export const NavBar = ({ user }: NavbarProps) => {

    const { logout } = useAuth();

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 hover:drop-shadow hover:text-gray-700 transition-all duration-300"><Link to="/">Noteshare</Link></h1>
                <div className="flex items-center gap-4">
                    <Link to={`/user/${user.username}`} className="text-gray-600 hover:text-gray-900 hover:drop-shadow transition-all duration-300">{user.username}</Link>
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