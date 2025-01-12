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
import { Modal } from '@mui/base/Modal';
import Button from '@mui/material/Button';

// Animated loading bar with mount key prop
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

// Loading screen component that handles its own mount state
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
        Loading changelogs...
      </Typography>
      <LoadingBar mountKey={mountKey} />
    </Box>
  );
};

export default function DashboardPage() {
  const [changelogs, setChangelogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState('edit');
  useEffect(() => {
    setIsLoading(true);
    
    fetch('https://api3.jailbreakchangelogs.xyz/changelogs/list')
      .then(response => response.json())
      .then(data => {
        setChangelogs(data);
        setTimeout(() => setIsLoading(false), 500); // Simulate loading for 2 seconds
      })
      .catch(error => {
        console.error('Failed to fetch changelogs:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const filteredChangelogs = changelogs.filter(log => 
    log.id.toString().includes(searchTerm)
  );

  const handleSelectChange = (event) => {
    setSelectedAction(event.target.value);
    console.log(`Selected action: ${event.target.value}`);

    // Perform the action based on the selected value
    if (event.target.value === 'edit') {
      handleEdit();
    } else if (event.target.value === 'delete') {
      handleDelete();
    }
  };

  const handleEdit = () => {
    console.log('Editing item...');
    // Add your editing logic here
  };

  const handleDelete = () => {

  };



  return (
    <Paper>
      <Box sx={{ paddingLeft: 2 }}>
        <TextField
          variant="outlined"
          label="Search by ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
        />
      </Box>
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
                <Select
                  label="Actions"
                  value={selectedAction}
                  onChange={handleSelectChange}
                  fullWidth
                >
                  <MenuItem value="edit">Edit</MenuItem>
                  {/* Make the delete action red */}
                  <MenuItem style={{ color: 'red' }} value="delete">Delete</MenuItem>
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