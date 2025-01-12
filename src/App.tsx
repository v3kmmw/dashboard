import * as React from 'react';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChangelogIcon from '@mui/icons-material/Article';
import ShoppingCartIcon from '@mui/icons-material/CalendarMonth';
import AccountIcon from '@mui/icons-material/AccountCircle';

// Import your custom header
const NAVIGATION: Navigation = [
  {
    kind: 'divider',
  },
  {
    segment: 'account',
    title: 'Account',
    icon: <AccountIcon />,  // Account Icon
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
  {
    title: 'Changelogs',
    icon: <ChangelogIcon />,  // Changelog Icon
  },
  {
    segment: 'seasons',
    title: 'Seasons',
    icon: <ShoppingCartIcon />,  // Shopping Cart Icon
  },
  
];

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
