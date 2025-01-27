import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  TablePagination,
  IconButton,
  Collapse,
  Grid
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
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
        Loading items...
      </Typography>
      <LoadingBar mountKey={mountKey} />
    </Box>
  );
};

const formatDateUTC = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get month name
    const month = months[date.getUTCMonth()];
    
    // Get day with ordinal suffix
    const day = date.getUTCDate();
    const ordinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    // Format hours for 12-hour clock
    let hours = date.getUTCHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${month} ${day}${ordinalSuffix(day)}, ${hours}:${minutes} ${ampm}`;
};

const ExpandableRow = ({ row, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.id} | {row.name}</TableCell>
        <TableCell>{row.type}</TableCell>
        <TableCell>{row.cash_value} | {row.duped_value}</TableCell>
        <TableCell>{row.demand}</TableCell>
        <TableCell>{row.notes}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onEdit(row)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => onDelete(row)}
            >
              Delete
            </Button>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
            <Grid container spacing={2}>
    <Grid 
        item 
        xs={6} 
        sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',    // Centers horizontally
            justifyContent: 'center' // Centers vertically
        }}
    >
        <Typography 
            variant="h6" 
            gutterBottom 
            component="div"
            sx={{ textAlign: 'center', marginBottom: 2 }}
        >
            Image
        </Typography>
        <img 
            width="400px" 
            src= {`https://testing.jailbreakchangelogs.xyz/assets/images/items/${row.type.toLowerCase()}s/${row.name}.webp`}
            alt="Torpedo"
        />
    </Grid>
    <Grid 
    item 
    xs={6}
    sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',    
        justifyContent: 'center' 
    }}
>
    <Typography 
        variant="h6" 
        gutterBottom 
        marginBottom={2}
        component="div"
        sx={{ textAlign: 'center' }}
    >
        Duped Owners
    </Typography>
    <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
        {row.duped_owners && row.duped_owners.split(',').slice(0, 8).map((owner, index) => (
             <Grid item key={index}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        padding: '8px 16px',
                        backgroundColor: '',
                        textAlign: 'center'
                    }}
                >
                    {owner.trim()}
                </Paper>
            </Grid>
        ))}
                {row.duped_owners && row.duped_owners.split(',').length > 8 && (
            <Grid item>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        padding: '8px 16px',
                        textAlign: 'center',
                        '&:hover': {
                            cursor: 'pointer'
                        },
                        transition: 'background-color 0.3s'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        ...{row.duped_owners.split(',').length - 8} more
                    </Typography>
                </Paper>
            </Grid>
        )}
    </Grid>
</Grid>
<Grid 
        item 
        xs={6} 
        sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',    // Centers horizontally
            justifyContent: 'center' // Centers vertically
        }}
    >
        <Typography 
            variant="h6" 
            gutterBottom 
            component="div"
            sx={{ textAlign: 'center', marginBottom: 2 }}
        >
            Description
        </Typography>
        <Typography>{row.description}</Typography>
    </Grid>
    <Grid 
        item 
        xs={6} 
        sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',    // Centers horizontally
            justifyContent: 'center' // Centers vertically
        }}
    >
        <Typography 
            variant="h6"  
            component="div"
            sx={{ textAlign: 'center' }}
        >
            Limited?
        </Typography>
        <Typography>
    {Number(row.is_limited) === 1 ? "True" : "False"}
</Typography>
<Typography 
            variant="h6" 
            component="div"
            sx={{ textAlign: 'center' }}
        >
            Last Updated
        </Typography>
        <Typography sx={{ textAlign: 'center' }}>
    {formatDateUTC(row.last_updated)}
</Typography>
</Grid>
</Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default function ItemsPage() {
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
    return seasons.filter((season) => {
        if (!season || !season.name) return false;
        
        const searchTerm = debouncedSearchTerm.toLowerCase();
        const itemName = season.name.toString().toLowerCase();
        
        return itemName.includes(searchTerm);
    });
}, [seasons, debouncedSearchTerm]);

  useEffect(() => {
    setIsLoading(true);
    if (sessionStorage.getItem('items')) {
      setSeasons(JSON.parse(sessionStorage.getItem('items')));
      setTimeout(() => setIsLoading(false), 500); // Simulate loading
    }

    fetch('https://api3.jailbreakchangelogs.xyz/items/list?nocache=true')
      .then(response => response.json())
      .then(data => {
        setSeasons(data);
        sessionStorage.setItem('items', JSON.stringify(data)); // Cache data
        setTimeout(() => setIsLoading(false), 500); // Simulate loading
      })
      .catch(error => {
        console.error('Failed to fetch items:', error);
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
    const maxPage = Math.ceil(filteredChangelogs.length / rowsPerPage) - 1;
    const safePage = Math.max(0, Math.min(newPage, maxPage));
    setPage(safePage);
};

const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
};
  return (
    <Paper>
      <Box sx={{ paddingLeft: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          variant="outlined"
          label="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          margin="normal"
        />
        <Button 
         variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
        >
        Add Item
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
              <TableCell />
              <TableCell>ID | Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell width={200}>Cash | Duped</TableCell>
              <TableCell>Demand</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredChangelogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="h6" align="center">
                    This item doesn't exist.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
                filteredChangelogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, index) => (               
                <ExpandableRow
                  key={index}
                  row={log}
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirmation}
                />
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
            Are you sure you want to delete this item? This action cannot be undone.
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
