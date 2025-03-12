import {
  LayoutDashboard,
  Home,
  StickyNote,
  Layers,
  Flag,
  Calendar,
  LifeBuoy,
  Settings,
  MoreVertical,
} from "lucide-react";
import Sidebar, { SidebarItem } from "./components/UIElments/Sidebar";
import GeminiImageText from "./components/models/main";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Projects from "./pages/sidebar/Projects";
import HomePage from "./pages/sidebar/HomePage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar>
          <SidebarItem icon={<Home size={20} />} text="Home" to="/" />
          <SidebarItem icon={<LayoutDashboard size={20} />} text="AI" to="/ai" />
          <SidebarItem icon={<StickyNote size={20} />} text="Projects" to="/projects" />
          <SidebarItem icon={<Calendar size={20} />} text="Calendar" to="/calendar" />
          <SidebarItem icon={<Layers size={20} />} text="Tasks" to="/tasks" />
          <SidebarItem icon={<Flag size={20} />} text="Reporting" to="/reporting" />
          <hr className="my-3" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" to="/settings" />
          <SidebarItem icon={<LifeBuoy size={20} />} text="Help" to="/help" />
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
        
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ai" element={<GeminiImageText />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/calendar" element={<h1>Calendar Page</h1>} />
              <Route path="/tasks" element={<h1>Tasks Page</h1>} />
              <Route path="/reporting" element={<h1>Reporting Page</h1>} />
              <Route path="/settings" element={<h1>Settings Page</h1>} />
              <Route path="/help" element={<h1>Help Page</h1>} />
              <Route path="/profile" element={<h1>Profile Page</h1>} />
              <Route path="/logout" element={<h1>Logout Page</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
