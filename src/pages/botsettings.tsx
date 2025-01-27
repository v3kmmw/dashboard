import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardActions, Button, Select, MenuItem } from '@mui/material';

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
        return (
            <Container>
                <Typography variant="h5" component="div">
                    Loading...
                </Typography>
            </Container>
        );
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