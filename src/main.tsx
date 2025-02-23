import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import ChangelogsPage from './pages/changelogs';
import DashboardPage from './pages'
import SeasonsPage from './pages/seasons';
import AccountPage from './pages/account';
import LoginPage from './pages/login';
import NotFoundPage from './pages/notfound';
import ItemsPage from './pages/items';
import BotSettings from './pages/botsettings';
import RewardsPage from './pages/rewards';
import OAuthSignInPage from './pages/signin';


const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/',
            Component: DashboardPage,
          },
          {
            path: 'changelogs',
            Component: ChangelogsPage
          },
          {
            path: 'bot',
            Component: BotSettings,
          },
          {
            path: 'seasons',
            Component: SeasonsPage
          },
          {
            path: 'seasons/seasons',
            Component: SeasonsPage,
          },
          {
            path: 'seasons/rewards',
            Component: RewardsPage,
          },
          {
            path: 'items',
            Component: ItemsPage,
          },
          {
            path: 'items/items',
            Component: ItemsPage,
          },
          {
            path: 'items/dupereports',
            Component: NotFoundPage,
          },

          {
            path: 'account',
            Component: AccountPage,
          },
          {
            path: 'login2',
            Component: LoginPage,
          },
          {
            path: 'login',
            Component: OAuthSignInPage,
          },
          {
            path: '*',
            Component: NotFoundPage
          }
        ],
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
