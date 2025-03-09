import {
  LayoutDashboard,
  Home,
  StickyNote,
  Layers,
  Flag,
  Calendar,
  LifeBuoy,
  Settings,
} from 'lucide-react';
import Sidebar, { SidebarItem } from './components/Sidebar';
import ImageAnalysisHeader from './components/ImageAnalysisHeader';
import GeminiImageText from './models/main';

function App() {
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem icon={<Home size={20} />} text="Home" alert />
        <SidebarItem icon={<LayoutDashboard size={20} />} text="AI" active />
        <SidebarItem icon={<StickyNote size={20} />} text="Projects" alert />
        <SidebarItem icon={<Calendar size={20} />} text="Calendar" />
        <SidebarItem icon={<Layers size={20} />} text="Tasks" />
        <SidebarItem icon={<Flag size={20} />} text="Reporting" />
        <hr className="my-3" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <ImageAnalysisHeader />
        <div className="flex-1">
          <GeminiImageText />
        </div>
      </div>
    </div>
  );
}

export default App;