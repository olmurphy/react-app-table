import { Bell, Home, User, Settings } from "lucide-react";
import Sidebar, { SidebarItem } from "./Sidebar";

function App() {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      // overflow: 'hidden',
      width: '100vw'
    }}>
      <div style={{
        display: 'flex',
        height: '100vh',
        // overflow: 'hidden',
      }}>
        <Sidebar>
          <SidebarItem icon={<Home />} text="Home" active />
          <SidebarItem icon={<Settings />} text="Settings" />
          <SidebarItem icon={<User />} text="Profile" />
          <SidebarItem icon={<Bell />} text="Notifications" alert />
        </Sidebar>
      </div>

      {/* <DataGridDemo /> */}
    </div>
  )
}

export default App;
