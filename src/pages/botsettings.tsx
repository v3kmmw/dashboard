import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardActions, Button, Select, MenuItem } from '@mui/material';



const LoadingBar = ({ mountKey }) => (
  <Box
    key={mountKey}
    className="loading-bar-container"
    sx={{
      width: '80%',
      height: '8px',
      borderRadius: '4px',
      overflow: 'hidden',
      background: '#f0f0f0',
      position: 'relative',
    }}
  >
    <Box
      className="loading-bar"
      key={mountKey}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '40%',
        background: '#748D92',
        borderRadius: '4px',
        animation: 'loading 2s infinite linear',
        '@keyframes loading': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(250%)',
          },
        }
      }}
    />
  </Box>
);

// Loading Screen Component
const LoadingScreen = () => {
  const [mountKey, setMountKey] = useState(0);

  useEffect(() => {
    // Force new mount key on every mount
    setMountKey(Date.now());
  }, []);

  return (
    <Box sx={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
    }}>
      <Typography variant="h6" color="text.secondary">
        Loading bot settings...
      </Typography>
      <LoadingBar mountKey={mountKey} />
    </Box>
  );
};
export default function BotSettings() {
    const [guilds, setGuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user && user.guilds) {
            const checkGuilds = async () => {
                const filteredGuilds = [];
                const batchSize = 10; // Number of concurrent requests
                for (let i = 0; i < user.guilds.length; i += batchSize) {
                    const batch = user.guilds.slice(i, i + batchSize);
                    const promises = batch.map(guild =>
                        fetch(`https://bot.jailbreakchangelogs.xyz/check?guild_id=${guild.id}`, {
                            method: 'GET'
                        })
                        .then(response => {
                            if (!response.ok && response.status !== 0) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            return guild
                        })
                        .catch(error => {
                            return null;
                        })
                    );
                    const results = await Promise.all(promises);
                    filteredGuilds.push(...results.filter(guild => guild !== null));
                }
                setGuilds(filteredGuilds);
                sessionStorage.setItem('filteredGuilds', JSON.stringify(filteredGuilds));
                setLoading(false);
            };

            const storedFilteredGuilds = sessionStorage.getItem('filteredGuilds');
            if (storedFilteredGuilds) {
                setGuilds(JSON.parse(storedFilteredGuilds));
                setLoading(false);
            } else {
                checkGuilds();
            }
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h5" component="div" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Grid container spacing={3}>
                {/* Long card at the top */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Select Guild
                            </Typography>
                            <Box mt={2}>
                                <Select defaultValue="" variant="outlined" fullWidth>
                                    {guilds.map(guild => (
                                        <MenuItem key={guild.id} value={guild.id}>{guild.name}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Other cards */}
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Card 1
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Some content for card 1.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">
                                Action 1
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Card 2
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Some content for card 2.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">
                                Action 2
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}