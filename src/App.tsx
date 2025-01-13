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
import CustomHeader from './layouts/CustomHeader';  // Adjust path if necessary

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

const BRANDING = {
  title: (
    <span style={{ color: 'var(--mui-palette-text-secondary)' }}>
      Jailbreak Changelogs Dashboard
    </span>
  ),
  logo: (
    <img
      src="/logo3.png"
      alt="Logo"
      style={{
        width: '40px',        // Set the width of the logo
        height: '40px',       // Set the height of the logo (same as width to maintain circular shape)
        borderRadius: '50%',  // This makes the image circular
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
