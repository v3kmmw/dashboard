import Cookies from 'js-cookie';
import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import {
  AuthResponse,
  SignInPage,
  type AuthProvider,
} from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

// OAuth Config
const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=1281308669299920907&response_type=code&redirect_uri=https%3A%2F%2Fdashboard.jailbreakchangelogs.xyz%2Flogin&scope=guilds+identify&prompt=none`;
const discordAuthUrl2 = "https://discord.com/oauth2/authorize?client_id=1281308669299920907&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin&scope=identify+guilds&prompt=none"

const providers = [{ id: 'discord', name: 'Discord' }];

const openDiscordPopup = () => {
  const width = 300, height = 500;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('permissions');

  const popup = window.open(
    discordAuthUrl,
    "Discord Login",
    `width=${width},height=${height},top=${top},status=no,scrollbars=no,resizable=no`
  );

  if (!popup) {
    alert("Popup blocked! Please allow popups.");
    return;
  }
};

export default function OAuthSignInPage() {
  const theme = useTheme();
  const [hasAuthData, setHasAuthData] = React.useState(false);

  // Check for authData cookie on component mount with debounce
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const processAuthData = () => {
      const authDataCookie = Cookies.get('authData');

      if (authDataCookie) {
        try {
          const authData = JSON.parse(authDataCookie);
          console.log("Data from cookie:", authData);

          sessionStorage.setItem('token', authData.token);
          sessionStorage.setItem('user', JSON.stringify(authData.user));
          sessionStorage.setItem('permissions', JSON.stringify(authData.permissions));

          Cookies.remove('authData', { domain: window.location.hostname, path: '/' }); // Remove the cookie
          console.log("Cookie removed");

          setHasAuthData(true); // Set state to trigger re-render and redirect
          window.location.href = '/'
        } catch (error) {
          console.error("Error parsing authData from cookie:", error);
          Cookies.remove('authData', { domain: window.location.hostname, path: '/' }); // Remove the cookie if parsing fails
        }
      }
    };

    timeoutId = setTimeout(processAuthData, 200); // Debounce for 200ms

    return () => {
      clearTimeout(timeoutId); // Clear timeout on unmount
    };
  }, []);

  // Handles authentication inside the popup
  const handleOAuthCallback = async () => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    try {
      const response = await fetch(`https://api3.jailbreakchangelogs.xyz/auth?code=${code}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (!data) return;
      console.log("Data from auth API:", data);

      if (data.token) {
        // Assuming data.permissions is already a valid JSON string array
        let permissions = data.permissions;
        if (typeof data.permissions === 'string') {
          try {
            // Attempt to parse if it's a string
            permissions = JSON.parse(data.permissions.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/'/g, '"'));
          } catch (error) {
            console.error('Failed to parse permissions string', error);
            permissions = [];
          }
        }

        const availablePermissions = Array.isArray(permissions) ? permissions : Object.keys(permissions).filter(key => permissions[key]);

        // Create a data object to store in the cookie
        const authData = {
          token: data.token,
          user: data,
          permissions: availablePermissions,
        };

        // Save the data in a cookie
        Cookies.set('authData', JSON.stringify(authData), { domain: window.location.hostname, path: '/' }); // Adjust domain as needed
        console.log("Data saved in cookie:", authData);

        // Redirect the main window
        window.close(); // Close the popup
        window.opener.location.reload()
      }
    } catch (error) {
      console.error('OAuth Error:', error);
    }
  };

  // If inside a popup, handle OAuth callback
  React.useEffect(() => {
    if (window.opener) {
      handleOAuthCallback();
    }
  }, []);

  const BRANDING = {
    logo: <img src="https://cdn.jakobiis.xyz/l6gtz1dgl" alt="LOGO" style={{ height: 256 }} />,
    title: 'Changelogs',
  };

  const signIn = async (provider: AuthProvider): Promise<AuthResponse> => {
    if (provider.id === 'discord') {
      openDiscordPopup();
      return { error: null };
    }
    return { error: 'Unknown provider' };
  };

  // Conditionally render null to prevent showing the sign-in page after auth
  if (hasAuthData) {
    return null;
  }

  return (
    <AppProvider branding={BRANDING} theme={theme}>
      <SignInPage signIn={signIn} providers={providers} />
    </AppProvider>
  );
}