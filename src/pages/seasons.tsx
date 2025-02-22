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
import TablePagination from '@mui/material/TablePagination';
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
        Loading seasons...
      </Typography>
      <LoadingBar mountKey={mountKey} />
    </Box>
  );
};

export default function SeasonsPage() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = '/login'
  }
  const [seasons, setSeasons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedChangelogForDelete, setSelectedChangelogForDelete] = useState(null);
  const auth = "Rd749u5TwffkhRoySXB7E6fg2phNkNhobHnkGRxvYsQMGS7ZJf";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50); // Adjust rows per page as needed
  const [changelogToEdit, setChangelogToEdit] = useState({
    season: '',
    title: '',
    description: '',
    start_date: '',
    end_date: ''
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
    return seasons.filter((season) =>
      season.season.toString().includes(debouncedSearchTerm)  // Filter without debounce
    );
  }, [seasons, debouncedSearchTerm]);  // Recalculate only when changelogs or searchTerm change


  useEffect(() => {
    setIsLoading(true);
    if (sessionStorage.getItem('seasons')) {
      setSeasons(JSON.parse(sessionStorage.getItem('seasons')));
      setTimeout(() => setIsLoading(false), 500); // Simulate loading
    }

    fetch('https://api3.jailbreakchangelogs.xyz/seasons/list?nocache=true')
      .then(response => response.json())
      .then(data => {
        setSeasons(data);
        sessionStorage.setItem('seasons', JSON.stringify(data)); // Cache data
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
    setSeasons(seasons.filter(log => log.id !== selectedChangelogForDelete.id));
    fetch(`https://api3.jailbreakchangelogs.xyz/seasons/delete?auth=${auth}&season=` + selectedChangelogForDelete.season, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(response => {
      console.log('Deleted season:', response);
    })
    sessionStorage.removeItem('seasons')

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
      season: '',
      title: '',
      description: '',
      start_date: '',
      end_date: ''
    }); // Reset add dialog fields
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setChangelogToEdit({
      season: '',
      title: '',
      description: '',
      start_date: '',
      end_date: ''
    }); // Reset the changelog to edit
  };

  const handleSaveAdd = () => {
    // Ensure all fields are filled before adding
    if (!changelogToEdit.title || !changelogToEdit.description) {
        alert("Please fill out all fields");
        return;
    }

    // Add the new changelog to the list
    const id = seasons.length + 1;

    changelogToEdit.season = id.toString();
    console.log('Adding changelog:', changelogToEdit);

    setSeasons([...seasons, changelogToEdit]);

    const body = {
      season: id,
      title: changelogToEdit.title,
      description: changelogToEdit.description,
      start_date: changelogToEdit.start_date,
      end_date: changelogToEdit.end_date
    };

    // Make sure to set the correct headers for the request
    fetch(`https://api3.jailbreakchangelogs.xyz/seasons/add?auth=${auth}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Tell the server we're sending JSON
      },
      body: JSON.stringify(body),  // The body needs to be a JSON string
    })
    .then(response => response.json())
    .then(data => {
      console.log('Added season:', data);
    })
    .catch(error => {
      console.error('Error adding season:', error);
    });
    sessionStorage.removeItem('seasons')

    // Close the dialog and reset the form
    setOpenAddDialog(false);
    setChangelogToEdit({
        season: '',
        title: '',
        description: '',
        start_date: '',
        end_date: ''
    });
};




const handleSaveEdit = () => {
    // Ensure all fields are filled before saving
    if (!changelogToEdit.season || !changelogToEdit.title || !changelogToEdit.description) {
        alert("Please fill out all fields");
        return;
    }

    // Save the changes to the changelog
    console.log('Saving changes to changelog:', changelogToEdit);
    const body = {
      title: changelogToEdit.title,
      description: changelogToEdit.description,
      start_date: changelogToEdit.start_date,
      end_date: changelogToEdit.end_date
    };

    // Make sure to set the correct headers for the request
    fetch(`https://api3.jailbreakchangelogs.xyz/seasons/update?auth=${auth}&season=` + changelogToEdit.season, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Tell the server we're sending JSON
      },
      body: JSON.stringify(body),  // The body needs to be a JSON string
    })
    .then(response => response.json())
    .then(data => {
      console.log('Updated season:', data);
    })
    .catch(error => {
      console.error('Error updating season:', error);
    });

    // Update the changelogs array in the state
    const updatedChangelogs = seasons.map(log => 
      log.season === changelogToEdit.season? changelogToEdit : log
    );
    setSeasons(updatedChangelogs);

    sessionStorage.removeItem('seasons') // Update cache

    // Close the dialog
    setOpenEditDialog(false);

    // Reset form state after saving
    setChangelogToEdit({
        season: '',
        title: '',
        description: '',
        start_date: '',
        end_date: ''
    });
};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    };

  return (
    <Paper>
      <Box sx={{ paddingLeft: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          variant="outlined"
          label="Search by season"
          value={searchTerm}
          onChange={handleSearchChange}
          margin="normal"
        />
        <Button 
         variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
        >
        Add Season
        </Button>
      </Box>
      <TableContainer>
      <TablePagination
          rowsPerPageOptions={[25, 50, 100]} // Adjust options as needed
          component="div"
          count={filteredChangelogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Season</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {filteredChangelogs.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6}>
        <Typography variant="h6" align="center">
          This season doesnt exist.
        </Typography>
      </TableCell>
    </TableRow>
  ) : (
    filteredChangelogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, index) => (
        <TableRow key={index}>
        <TableCell>{log.season}</TableCell>
        <TableCell>{log.title}</TableCell>
        <TableCell>{log.description}</TableCell>
        <TableCell>{log.start_date}</TableCell>
        <TableCell>{log.end_date}</TableCell>
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
    ))
  )}
</TableBody>

        </Table>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]} // Adjust options as needed
          component="div"
          count={filteredChangelogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openConfirmDeleteDialog}
        onClose={handleCloseConfirmDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this season? This action cannot be undone.
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
        <DialogTitle>Add Season</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={changelogToEdit.title}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={changelogToEdit.description}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Start Date"
            value={changelogToEdit.start_date}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, start_date: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            value={changelogToEdit.end_date}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, end_date: e.target.value })}
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
        <DialogTitle>Edit Season</DialogTitle>
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
            value={changelogToEdit.description}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Start Date"
            value={changelogToEdit.start_date}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, start_date: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            value={changelogToEdit.end_date}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, end_date: e.target.value })}
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
