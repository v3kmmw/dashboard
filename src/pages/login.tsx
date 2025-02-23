import * as React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function LoginPage() {
    // get the code out of the url
    const code = new URLSearchParams(window.location.search).get("code");
    useEffect(() => {
        if (code) {
            window.history.pushState({}, null, "/login");
            const debounced = setTimeout(() => {
                fetch('https://api3.jailbreakchangelogs.xyz/auth?code=' + code, {
                    method: 'POST'
                }).then(response => response.json())
                .then(data => {
                    if (data) {
                        const token = data.token;
                        sessionStorage.setItem('token', token);
                        sessionStorage.setItem('user', JSON.stringify(data));
                        sessionStorage.removeItem('permissions')
                        let permissionsString = data.permissions;

                        // Fix single quotes and Python `True`/`False`
                        permissionsString = permissionsString
                            .replace(/'/g, '"') // Replace single quotes with double quotes
                            .replace(/\bTrue\b/g, 'true') // Fix True → true
                            .replace(/\bFalse\b/g, 'false'); // Fix False → false
                        
                        let permissionsObject;
                        
                        try {
                            permissionsObject = JSON.parse(permissionsString); // Now it's valid JSON
                        } catch (error) {
                            console.error("JSON Parse Error:", error, "Fixed Data:", permissionsString);
                            permissionsObject = {}; // Fallback
                        }
                        
                        console.log("Parsed permissions:", permissionsObject);
                        
                        const availablePermissions = Object.keys(permissionsObject).filter(key => permissionsObject[key]);
                        sessionStorage.setItem("permissions", JSON.stringify(availablePermissions));
                        
                        
                        window.location.href = '/'
                    }
                });
            }, 300);
            return () => clearTimeout(debounced);
        }
    }, [code]);

    const handleLogin = () => {
        const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=1281308669299920907&response_type=code&redirect_uri=https%3A%2F%2Fdashboard.jailbreakchangelogs.xyz%2Flogin&scope=guilds+identify&prompt=none`;
        const discordAuthUrl2 = "https://discord.com/oauth2/authorize?client_id=1281308669299920907&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin&scope=identify+guilds&prompt=none"
        window.location.href = discordAuthUrl2;
    };

    const handleLogin2 = () => {
      const tokenElement = document.getElementById('token') as HTMLInputElement;
      const token = tokenElement.value;
        fetch('https://api3.jailbreakchangelogs.xyz/users/get/token?token=' + token)
            .then(response => response.json())
            .then(data => {
                if (data) {
                  
                    if (!data.id) {
                      alert('User not found');
                      return;
                    }
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('user', JSON.stringify(data));
                    window.location.href = '/';
                } else {
                    console.error('Invalid token or user data not found');
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
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
                    <Card style={{ height: 400, marginTop: '2rem' }}>
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