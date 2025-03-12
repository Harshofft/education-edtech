import { useState, createContext, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/logo.svg';
import profile from "../../assets/profile.svg";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation(); // Get current route

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-menu")) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <SidebarContext.Provider value={{ expanded, location }}>
            <aside className="h-screen">
                <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <img src={logo} className={`overflow-hidden transition-all ${expanded ? "w-12" : "w-0"}`} />
                        <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>

                    <ul className="flex-1 px-3">{children}</ul>

                    {/* Profile & Dropdown */}
                    <div className="border-t flex p-3 relative">
                        <img src={profile} className="w-10 h-10 rounded-md" />
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                            <div className="leading-4">
                                <h4 className="font-semibold">Edtech</h4>
                                <span className="text-xs text-gray-600">edtech@gmail.com</span>
                            </div>
                            <button 
                                className="p-2 rounded-full hover:bg-gray-100" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDropdownOpen(!dropdownOpen);
                                }}
                            >
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="dropdown-menu absolute bottom-12 right-0 w-48 bg-white shadow-lg rounded-lg p-2 z-50">
                                <ul>
                                    {["Profile", "Logout"].map((item) => (
                                        <Link key={item} to={`/${item.toLowerCase()}`} className="block">
                                            <li 
                                                className={`px-3 py-2 rounded-md cursor-pointer transition-colors
                                                    ${location.pathname === `/${item.toLowerCase()}` ? "bg-indigo-200 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}
                                            >
                                                {item}
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>
        </SidebarContext.Provider>
    );
}

// Sidebar Item Component
export function SidebarItem({ icon, text, to }) {
    const { expanded, location } = useContext(SidebarContext);
    
    return (
        <Link to={to} className="block">
            <li 
                className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
                    ${location.pathname === to ? "bg-indigo-200 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}
            >
                {icon}
                <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            </li>
        </Link>
    );
}
