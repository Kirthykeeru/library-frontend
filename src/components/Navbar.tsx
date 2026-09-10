import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClasses =
  "text-sm font-medium text-slate-300 hover:text-white transition-colors";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/books" className="flex items-center gap-2 text-white font-semibold text-lg">
          <span className="text-2xl">📚</span>
          College Library
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/books" className={linkClasses}>
            Books
          </Link>

          {user?.role === "staff" && (
            <>
              <Link to="/members" className={linkClasses}>
                Members
              </Link>
              <Link to="/borrow-records" className={linkClasses}>
                Borrow Records
              </Link>
            </>
          )}

          {user?.role === "student" && (
            <Link to="/my-borrows" className={linkClasses}>
              My Borrows
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
              <span className="text-sm text-slate-400">
                {user.username}{" "}
                <span className="uppercase text-xs font-semibold text-indigo-400">
                  {user.role}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
