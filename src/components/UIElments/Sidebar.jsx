import { useState, createContext, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import profile from "../../assets/profile.svg";
import {
  ChevronFirst,
  ChevronLast,
  MoreVertical,
  Sun,
  Moon,
} from "lucide-react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const location = useLocation();

  const { openSignIn, signOut, openUserProfile } = useClerk();
  const { isSignedIn, isLoaded, user } = useUser(); // Destructure 'user' object here

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        !event.target.closest(".profile-dropdown-container")
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleProfileAreaClick = () => {
    if (!isLoaded) {
      return;
    }
    if (isSignedIn) {
      openUserProfile();
    } else {
      openSignIn();
    }
  };

  const handleViewProfileClick = () => {
    if (isSignedIn) {
      openUserProfile();
    } else {
      openSignIn();
    }
    setDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    signOut();
    setDropdownOpen(false);
  };

  return (
    <SidebarContext.Provider value={{ expanded, location, theme }}>
      <aside
        className={`h-screen ${
          theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white"
        }`}
      >
        <nav
          className={`h-full flex flex-col border-r shadow-sm ${
            theme === "dark" ? "border-gray-700 bg-gray-900" : "bg-white"
          }`}
        >
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={logo}
              className={`overflow-hidden transition-all ${
                expanded ? "w-10" : "w-0"
              }`}
              alt="Logo"
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className={`p-1.5 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <ul className="flex-1 px-3">{children}</ul>

          <div
            className={`border-t flex p-3 relative profile-dropdown-container ${
              theme === "dark" ? "border-gray-700" : ""
            }`}
          >
            <div
              onClick={handleProfileAreaClick}
              className={`flex items-center gap-3 text-sm p-2 rounded-lg cursor-pointer
                ${
                  expanded
                    ? theme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                    : "justify-center w-full"
                }
                ${theme === "dark" ? "text-gray-300" : "text-gray-600"}
              `}
            >
              {isLoaded && isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10",
                    },
                  }}
                />
              ) : (
                <img
                  src={profile}
                  alt="Profile"
                  className="w-10 h-10 rounded-md"
                />
              )}
              {/* Conditional display of "Hi, FirstName" */}
              {expanded && isLoaded && isSignedIn ? (
                <span>Hi, {user.firstName || 'User'}</span>
              ) : expanded ? (
                <span>My Profile</span>
              ) : null}
            </div>

            {expanded && (
              <button
                onClick={() => setDropdownOpen((curr) => !curr)}
                className={`p-1.5 rounded-lg absolute right-3 top-1/2 -translate-y-1/2 ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <MoreVertical />
              </button>
            )}

            {dropdownOpen && (
              <div
                className={`absolute bottom-full left-3 mb-2 w-48 rounded-md shadow-lg py-1 ${
                  theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white"
                }`}
              >
                <button
                  onClick={handleViewProfileClick}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  View Profile
                </button>
                <button
                  onClick={toggleTheme}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  {theme === "light" ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : (
                    <Sun className="mr-2 h-4 w-4" />
                  )}
                  {theme === "light" ? "Switch to Dark" : "Switch to Light"}
                </button>
                <button
                  onClick={handleLogoutClick}
                  className={`block w-full text-left px-4 py-2 text-sm text-red-600 ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

export function SidebarItem({ icon, text, to }) {
  const { expanded, location, theme } = useContext(SidebarContext);

  return (
    <Link to={to} className="block">
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
                    ${
                      location.pathname === to
                        ? theme === "dark"
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-200 text-indigo-800"
                        : theme === "dark"
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-indigo-50 text-gray-600"
                    }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-40 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
      </li>
    </Link>
  );
}