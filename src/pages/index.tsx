import * as React from 'react';
import { useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Container, Box } from '@mui/material';

export default function DashboardPage() {
  const token = sessionStorage.getItem('token');
  const [memberCount, setMemberCount] = React.useState(0);
  const [changelogCount, setChangelogCount] = React.useState(0);
  const [seasonCount, setSeasonCount] = React.useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch(`https://api3.jailbreakchangelogs.xyz/users/list`);
        const usersData = await usersResponse.json();
        setMemberCount(usersData.length);

        const changelogsResponse = await fetch(`https://api3.jailbreakchangelogs.xyz/changelogs/list`);
        const changelogsData = await changelogsResponse.json();
        setChangelogCount(changelogsData.length);

        const seasonsResponse = await fetch(`https://api3.jailbreakchangelogs.xyz/seasons/list`);
        const seasonsData = await seasonsResponse.json();
        setSeasonCount(seasonsData.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Members
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {memberCount} members
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Changelogs
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {changelogCount} changelogs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Seasons
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {seasonCount} seasons
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Jailbreak Changelogs dashboard.
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          This dashboard handles management for the website, including changelogs, seasons, values, and more.
        </Typography>
        <Typography variant="h5" gutterBottom>
          Missing a permission? See an issue?
        </Typography>
        <Typography variant="body1" color="textSecondary">
          If you come across any issues, please contact @jakobiis.
        </Typography>
      </Box>
    </Container>
  );
}