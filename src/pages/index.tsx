import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import debounce from 'lodash.debounce';
// Loading Bar Component
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
        Loading changelogs...
      </Typography>
      <LoadingBar mountKey={mountKey} />
    </Box>
  );
};

export default function DashboardPage() {
  const [changelogs, setChangelogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedChangelogForDelete, setSelectedChangelogForDelete] = useState(null);
  const auth = "Rd749u5TwffkhRoySXB7E6fg2phNkNhobHnkGRxvYsQMGS7ZJf";
  const [changelogToEdit, setChangelogToEdit] = useState({
    id: '',
    title: '',
    sections: '',
    image_url: ''
  });

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 500), // Delay in ms
    []
  );

  // Handle the change in the search input field
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);  // Immediately update the searchTerm as user types
    debouncedSetSearchTerm(value);  // Trigger debounced function
  };

  // Filter changelogs based on the debounced search term
  const filteredChangelogs = useMemo(() => {
    return changelogs.filter((log) =>
      log.id.toString().includes(debouncedSearchTerm)  // Filter without debounce
    );
  }, [changelogs, debouncedSearchTerm]);  // Recalculate only when changelogs or searchTerm change


  useEffect(() => {
    setIsLoading(true);
    if (sessionStorage.getItem('changelogs')) {
      setChangelogs(JSON.parse(sessionStorage.getItem('changelogs')));
      setTimeout(() => setIsLoading(false), 500); // Simulate loading
    }

    fetch('https://api3.jailbreakchangelogs.xyz/changelogs/list?nocache=true')
      .then(response => response.json())
      .then(data => {
        setChangelogs(data);
        sessionStorage.setItem('changelogs', JSON.stringify(data)); // Cache data
        setTimeout(() => setIsLoading(false), 500); // Simulate loading
      })
      .catch(error => {
        console.error('Failed to fetch changelogs:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleEdit = (log) => {
    setChangelogToEdit(log);
    setOpenEditDialog(true); // Open the edit dialog
  };

  const handleDeleteConfirmation = (log) => {
    setSelectedChangelogForDelete(log);
    setOpenConfirmDeleteDialog(true); // Open the delete confirmation dialog
  };

  const handleConfirmDelete = () => {
    setChangelogs(changelogs.filter(log => log.id !== selectedChangelogForDelete.id));
    fetch(`https://api3.jailbreakchangelogs.xyz/changelogs/delete?auth=${auth}&id=` + selectedChangelogForDelete.id, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(response => {
      console.log('Deleted changelog:', response);
    })
    sessionStorage.removeItem('changelogs')

    setOpenConfirmDeleteDialog(false);
    setSelectedChangelogForDelete(null);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
    setSelectedChangelogForDelete(null);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setChangelogToEdit({
      id: '',
      title: '',
      sections: '',
      image_url: ''
    }); // Reset add dialog fields
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setChangelogToEdit({
      id: '',
      title: '',
      sections: '',
      image_url: ''
    }); // Reset the changelog to edit
  };

  const handleSaveAdd = () => {
    // Ensure all fields are filled before adding
    if (!changelogToEdit.title || !changelogToEdit.sections) {
        alert("Please fill out all fields");
        return;
    }

    // Add the new changelog to the list
    const id = changelogs.length + 1;

    changelogToEdit.id = id.toString();
    console.log('Adding changelog:', changelogToEdit);

    setChangelogs([...changelogs, changelogToEdit]);

    const body = {
      id: id,
      title: changelogToEdit.title,
      sections: changelogToEdit.sections,
      image_url: changelogToEdit.image_url
    };

    // Make sure to set the correct headers for the request
    fetch(`https://api3.jailbreakchangelogs.xyz/changelogs/add?auth=${auth}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Tell the server we're sending JSON
      },
      body: JSON.stringify(body),  // The body needs to be a JSON string
    })
    .then(response => response.json())
    .then(data => {
      console.log('Added changelog:', data);
    })
    .catch(error => {
      console.error('Error adding changelog:', error);
    });
    sessionStorage.removeItem('changelogs')

    // Close the dialog and reset the form
    setOpenAddDialog(false);
    setChangelogToEdit({
        id: '',
        title: '',
        sections: '',
        image_url: ''
    });
};




const handleSaveEdit = () => {
    // Ensure all fields are filled before saving
    if (!changelogToEdit.id || !changelogToEdit.title || !changelogToEdit.sections) {
        alert("Please fill out all fields");
        return;
    }

    // Save the changes to the changelog
    console.log('Saving changes to changelog:', changelogToEdit);
    const body = {
      title: changelogToEdit.title,
      sections: changelogToEdit.sections,
      image_url: changelogToEdit.image_url
    };

    // Make sure to set the correct headers for the request
    fetch(`https://api3.jailbreakchangelogs.xyz/changelogs/update?auth=${auth}&id=` + changelogToEdit.id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Tell the server we're sending JSON
      },
      body: JSON.stringify(body),  // The body needs to be a JSON string
    })
    .then(response => response.json())
    .then(data => {
      console.log('Updated changelog:', data);
    })
    .catch(error => {
      console.error('Error updating changelog:', error);
    });

    // Update the changelogs array in the state
    const updatedChangelogs = changelogs.map(log => 
      log.id === changelogToEdit.id? changelogToEdit : log
    );
    setChangelogs(updatedChangelogs);

    sessionStorage.removeItem('changelogs') // Update cache

    // Close the dialog
    setOpenEditDialog(false);

    // Reset form state after saving
    setChangelogToEdit({
        id: '',
        title: '',
        sections: '',
        image_url: ''
    });
};


  return (
    <Paper>
      <Box sx={{ paddingLeft: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          variant="outlined"
          label="Search by ID"
          value={searchTerm}
          onChange={handleSearchChange}
          margin="normal"
        />
        <Button 
         variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
        >
        Add Changelog
        </Button>
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(log)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteConfirmation(log)}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openConfirmDeleteDialog}
        onClose={handleCloseConfirmDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this changelog? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Changelog Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        PaperProps={{
          style: {
            width: 'auto',
            maxWidth: 'none',
            minWidth: '50%'
          }
        }}
      >
        <DialogTitle>Add Changelog</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={changelogToEdit.title}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sections"
            value={changelogToEdit.sections}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, sections: e.target.value })}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Image URL"
            value={changelogToEdit.image_url}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, image_url: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleSaveAdd} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Changelog Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        PaperProps={{
          style: {
            width: 'auto',
            maxWidth: 'none',
            minWidth: '50%'
          }
        }}
      >
        <DialogTitle>Edit Changelog</DialogTitle>
        <DialogContent>3
          <TextField
            label="Title"
            value={changelogToEdit.title}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sections"
            value={changelogToEdit.sections}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, sections: e.target.value })}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Image URL"
            value={changelogToEdit.image_url}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, image_url: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
