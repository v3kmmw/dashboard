import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function DashboardPage() {
  const [changelogs, setChangelogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    // Trigger loading state before the async operation starts
    setLoading(true);
  
    // Use requestAnimationFrame to force a re-render before making the request
    requestAnimationFrame(async () => {
      console.log('Fetching changelogs from API...');  // Debugging: log fetch
  
      try { 
        const response = await fetch('https://api3.jailbreakchangelogs.xyz/changelogs/list');
        const json = await response.json();
        setChangelogs(json);  // Set fetched changelogs to state variable
      } catch (error) {
        console.error('Failed to fetch changelogs:', error);
      } finally {
        // Stop loading when the fetch operation finishes
        setLoading(false);
      }
    });
  }, []);  // Empty dependency array ensures this runs once on component mount
  

  const filteredChangelogs = changelogs.filter((log) =>
    log.id.toString().includes(searchTerm)
  );

  // Show loading progress bar if data is loading
  if (loading) {
    return (
      <Box sx={{
        width: '100%',
        height: '100vh',  // Ensure the progress bar stretches vertically if necessary
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',  // Center the progress bar horizontally and vertically
      }}>
        <LinearProgress sx={{ width: '80%' }} />  {/* Set width of the linear progress bar */}
      </Box>
    );
  } 

  return (
    <Paper>
      {/* Search box */}
      <Box sx={{ paddingLeft: 2 }}>
        <TextField
          variant="outlined"
          label="Search by ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
        />
      </Box>

      {/* Table with filtered changelogs */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Sections</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredChangelogs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.title}</TableCell>
                <TableCell>{log.sections}</TableCell>
                <TableCell>{log.image_url}</TableCell>
                <TableCell>
                  <Select label="Actions" value="edit">
                    <MenuItem value="edit">Edit</MenuItem>
                    <MenuItem value="delete">Delete</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
