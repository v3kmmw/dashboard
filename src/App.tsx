import * as React from 'react';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';
// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import ChangelogIcon from '@mui/icons-material/Article';
import CalenderIcon from '@mui/icons-material/CalendarMonth';
import AccountIcon from '@mui/icons-material/AccountCircle';
import PrizeIcon from '@mui/icons-material/EmojiEvents';
import VehicleIcon from '@mui/icons-material/DirectionsCar';
import CommentIcon from '@mui/icons-material/Comment';
import PeopleIcon from '@mui/icons-material/PeopleAlt';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';
import BugReportIcon from '@mui/icons-material/BugReport';
import TaxiAlertIcon from '@mui/icons-material/TaxiAlert';
import CampaignIcon from '@mui/icons-material/Campaign';
import DnsIcon from '@mui/icons-material/Dns';
// Ensure user details are set
const token = sessionStorage.getItem('token');
const user = JSON.parse(sessionStorage.getItem('user'));
if (token && !user) {
  fetch(`https://api3.jailbreakchangelogs.xyz/users/get/token?token=${token}`)
    .then(response => response.json())
    .then(data => {
      if (data) {
        sessionStorage.setItem('user', JSON.stringify(data));
      }
    });
}
let nav;
if (user) {
  const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`;
  nav = [
    {
      kind: 'divider',
    },
    {
      segment: 'account',
      title: 'Account',
      icon: <img src={avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />,
    },
    {
      title: 'Home',
      icon: <HomeIcon />,
    },
    {
      kind: 'divider',
    },
    {
      kind: 'header',
      title: 'Available Controls',
    },
    {
      kind: 'divider',
    },
  ];
    let permissions = JSON.parse(sessionStorage.getItem('permissions'));
    if (!permissions) {
      fetch(`https://api3.jailbreakchangelogs.xyz/permissions/get?token=${sessionStorage.getItem('token')}`)
      .then(response => response.json())
      .then(data => {
        try {
          const correctedPermissionsJson = data.permissions.replace(/'/g, '"').replace(/False/g, 'false').replace(/True/g, 'true');
          const parsedPermissions = JSON.parse(correctedPermissionsJson);
          const availablePermissions = Object.keys(parsedPermissions).filter(permission => parsedPermissions[permission]);
          sessionStorage.setItem('permissions', JSON.stringify(availablePermissions));
          window.location.reload();
        } catch (error) {
          console.error('Error parsing permissions:', error);
        }
      })
    }
    if (permissions) {
    if (permissions.includes('changelogs')) {
      nav.push({
        segment: 'changelogs',
        title: 'Changelogs',
        icon: <ChangelogIcon />,
      });
    }
    if (permissions.includes('seasons')) {
      let children = [];
    
      children.push({
        segment: 'seasons', // Modified segment name
        title: 'Seasons',
        icon: <CalenderIcon />,
        type: 'child', // Added type property
      });
    
      if (permissions.includes('rewards')) {
        children.push({
          segment: 'rewards',
          title: 'Rewards',
          icon: <PrizeIcon />,
          type: 'child', // Added type property
        });
      }
    
      nav.push({
        segment: 'seasons',
        title: 'Seasons',
        icon: <CalenderIcon />,
        children: children,
        type: 'parent', // Added type property
      });
    }
    if (permissions.includes('items')) {
      let children = [];

      children.push({
        segment: 'items',
        title: 'Items',
        icon: <VehicleIcon />,
      });
      children.push({
        segment: 'dupereports',
        title: 'Dupe Reports',
        icon: <TaxiAlertIcon />,
      });
      nav.push({
        segment: 'items',
        title: 'Items',
        icon: <VehicleIcon />,
        children: children,
        type: 'parent', // Added type property
      });
    }
    if (permissions.includes('servers')) {
      nav.push({
        segment:'servers',
        title: 'Servers',
        icon: <DnsIcon />,
      });
    }
    if (permissions.includes('comments')) {
      nav.push({
        segment: 'comments',
        title: 'Comments',
        icon: <CommentIcon />,
      });
    }
    if (permissions.includes('campaigns')) {
      nav.push({
        segment: 'campaigns',
        title: 'Campaigns',
        icon: <CampaignIcon />,
      });
    }
    if (permissions.includes('users')) {
      nav.push({
        segment: 'users',
        title: 'Users',
        icon: <PeopleIcon />,
      });
  }
}

} else {
  nav = [
    {
      kind: 'divider',
    },
    {
      segment: 'login',
      title: 'Login',
      icon: <AccountIcon />,
    },
  ];
}

const NAVIGATION: Navigation = nav;

const BRANDING: any = {
  title: (
    <span style={{ color: 'var(--mui-palette-text-secondary)' }}>
      JBC Dashboard
    </span>
  ),
  logo: (
    <img
      src="https://cdn.jakobiis.xyz/l6gtz1dgl"
      alt="Logo"
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
      }}
    />
  ),
};

export default function App() {

  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}