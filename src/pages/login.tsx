import * as React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

export default function LoginPage() {
    // get the code out of the url
    const code = new URLSearchParams(window.location.search).get("code");
    useEffect(() => {
        if (code) {
            const debounced = setTimeout(() => {
                fetch('https://api3.jailbreakchangelogs.xyz/auth?code=' + code, {
                    method: 'POST'
                }).then(response => response.json())
                .then(data => {
                    if (data) {
                        const token = data.token;
                        sessionStorage.setItem('token', token);
                        sessionStorage.setItem('user', JSON.stringify(data));
                        window.location.href = '/'
                    }
                })
                fetch(`https://api3.jailbreakchangelogs.xyz/permissions/get?token=${sessionStorage.getItem('token')}`)
                .then(response => response.json())
                .then(data => {
                    try {
                        const correctedPermissionsJson = data.permissions.replace(/'/g, '"').replace(/False/g, 'false').replace(/True/g, 'true');
                        const parsedPermissions = JSON.parse(correctedPermissionsJson);
                        const availablePermissions = Object.keys(parsedPermissions).filter(permission => parsedPermissions[permission]);
                        sessionStorage.setItem('permissions', JSON.stringify(availablePermissions));
                    } catch (error) {
                        console.error('Error parsing permissions:', error);
                    }
                })
            }, 300);
            return () => clearTimeout(debounced)
        }
    }, [code]);



    const handleLogin = () => {
       const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=1281308669299920907&response_type=code&redirect_uri=https%3A%2F%2Fdashboard.jailbreakchangelogs.xyz%2Flogin&scope=identify`;
       window.location.href = discordAuthUrl;
  };

  return (
    <Container>
      <Grid 
        container 
        spacing={0} 
        direction="column" 
        alignItems="center" 
        justifyContent="flex-start" 
        style={{ minHeight: '75vh' }}
      >
        <Grid item>
          <Card style={{height: 300, marginTop: '2rem' }}>
            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" component="div">
                Login with Discord
              </Typography>
              <Typography variant="body1" component="p" style={{ marginTop: '1rem', textAlign: 'center' }}>
              Connect your Discord account to access our dashboard.
              </Typography>
            </CardContent>
            <CardActions style={{ justifyContent: 'center', marginTop: 'auto' }}>
              <Button 
                size="large" 
                color="primary" 
                variant="outlined" 
                onClick={handleLogin}
              >
                Login
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
