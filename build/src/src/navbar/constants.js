import Dashboard from "Icons/Dashboard";
import Activity from "Icons/Activity";
import Devices from "Icons/Devices";
import Folder from "Icons/Folder";
import NewFolder from "Icons/NewFolder";
import Settings from "Icons/Settings";

// NAVBAR
// This will be used later in the root reducer and selectors
export const NAME = "navbar";

export const navbarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Dashboard
  },
  {
    name: "Activity",
    href: "/activity",
    icon: Activity
  },
  {
    name: "Devices",
    href: "/devices",
    icon: Devices
  },
  {
    name: "Installer",
    href: "/installer",
    icon: NewFolder
  },
  {
    name: "Packages",
    href: "/packages",
    icon: Folder
  },
  {
    name: "System",
    href: "/system",
    icon: Settings
  }
];
