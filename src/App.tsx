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

// Ensure user details are set
const user = JSON.parse(sessionStorage.getItem('user'));
if (!user && window.location.pathname !== '/login') {
  window.location.href = '/login';
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
      title: 'Available Database Controls',
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
          permissions = availablePermissions
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
      nav.push({
        segment: 'seasons',
        title: 'Seasons',
        icon: <CalenderIcon />,
      });
    }
    if (permissions.includes('rewards')) {
      nav.push({
        segment: 'rewards',
        title: 'Rewards',
        icon: <PrizeIcon />,
      });
    }
    if (permissions.includes('items')) {
      nav.push({
        segment: 'items',
        title: 'Items',
        icon: <VehicleIcon />,
      });
    }
    if (permissions.includes('comments')) {
      nav.push({
        segment: 'comments',
        title: 'Comments',
        icon: <CommentIcon />,
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
      src="https://cdn.jakobiis.xyz/nze0f6kli"
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