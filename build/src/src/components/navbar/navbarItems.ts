// FundedBy icons
import EfgLogo from "img/logos/efg-logo-only-min.png";
import AragonLogo from "img/logos/aragon-min.png";
import GivethLogo from "img/logos/giveth-min.png";
import EcfLogo from "img/logos/ecf-min.png";
// Icons
import Dashboard from "Icons/Dashboard";
import Devices from "Icons/Devices";
import Folder from "Icons/Folder";
import NewFolder from "Icons/NewFolder";
import Settings from "Icons/Settings";
import Build from "Icons/Build";
import ContactSupport from "Icons/ContactSupport";

export const fundedBy: { logo: string; text: string; link?: string }[] = [
  {
    logo: EfgLogo,
    text: "Ethereum Foundation",
    link:
      "https://blog.ethereum.org/2018/08/17/ethereum-foundation-grants-update-wave-3/"
  },
  {
    logo: AragonLogo,
    text: "Aragon Nest",
    link: "https://blog.aragon.org/aragon-nest-second-round-of-grants/#dappnode"
  },
  {
    logo: GivethLogo,
    text: "Giveth",
    link: "https://beta.giveth.io/campaigns/5b44b198647f33526e67c262"
  },
  {
    logo: EcfLogo,
    text: "Ethereum Community Fund"
  }
];

export const sidenavItems: {
  name: string;
  href: string;
  icon: (props: any) => JSX.Element;
}[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Dashboard
  },
  {
    name: "Devices",
    href: "/devices",
    icon: Devices
  },
  {
    name: "DAppStore",
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
  },
  {
    name: "Sdk",
    href: "/sdk",
    icon: Build
  },
  {
    name: "Support",
    href: "/support",
    icon: ContactSupport
  }
];
