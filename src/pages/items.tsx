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
  FormControlLabel,
  DialogTitle,
  DialogContentText,
  TextField,
  Checkbox,
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
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Collapse in={open} timeout="auto" unmountOnExit>
    <Box margin={1}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Image
            </Typography>
            <img
              width="400px"
              src={`https://testing.jailbreakchangelogs.xyz/assets/images/items/${row.type.toLowerCase()}s/${row.name}.webp`}
              alt="Torpedo"
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Duped Owners
            </Typography>
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
              {row.duped_owners &&
                row.duped_owners.split(',').slice(0, 8).map((owner, index) => (
                  <Grid item key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        padding: '8px 16px',
                        textAlign: 'center',
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
                        cursor: 'pointer',
                      },
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      ...{row.duped_owners.split(',').length - 8} more
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography>{row.description}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6">
              Limited?
            </Typography>
            <Typography>
              {Number(row.is_limited) === 1 ? 'True' : 'False'}
            </Typography>
            <Typography variant="h6">
              Last Updated
            </Typography>
            <Typography>
              {formatDateUTC(row.last_updated)}
            </Typography>
          </Paper>
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
    id: null,
    name: '',
    type: '',
    cash_value: '',
    duped_value: '',
    price: '',
    is_limited: false,
    duped_owners: '',
    notes: '',
    demand: '',
    description: '',
    health: '',
    tradable: false
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
      id: null,
      name: '',
      type: '',
      cash_value: '',
      duped_value: '',
      price: '',
      is_limited: false,
      duped_owners: '',
      notes: '',
      demand: '',
      description: '',
      health: '',
      tradable: false
    }); // Reset add dialog fields
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setChangelogToEdit({
      id: null,
      name: '',
      type: '',
      cash_value: '',
      duped_value: '',
      price: '',
      is_limited: false,
      duped_owners: '',
      notes: '',
      demand: '',
      description: '',
      health: '',
      tradable: false
    }); // Reset the changelog to edit
  };

  const handleSaveAdd = () => {

    // Add the new changelog to the list
    const id = seasons.length + 1;

    changelogToEdit.id = id.toString();
    console.log('Adding changelog:', changelogToEdit);

    setSeasons([...seasons, changelogToEdit]);

    const body = {
      name: changelogToEdit.name,
      type: changelogToEdit.type,
      cash_value: changelogToEdit.cash_value,
      duped_value: changelogToEdit.duped_value,
      price: changelogToEdit.price,
      is_limited: changelogToEdit.is_limited,
      duped_owners: changelogToEdit.duped_owners || 'N/A',
      notes: changelogToEdit.notes,
      demand: changelogToEdit.demand,
      description: changelogToEdit.description,
      health: changelogToEdit.health,
      tradable: changelogToEdit.tradable
    };

    // Make sure to set the correct headers for the request
    fetch(`https://api3.jailbreakchangelogs.xyz/items/add?auth=${auth}`, {
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
    sessionStorage.removeItem('items')

    // Close the dialog and reset the form
    setOpenAddDialog(false);
    setChangelogToEdit({
      id: null,
      name: '',
      type: '',
      cash_value: '',
      duped_value: '',
      price: '',
      is_limited: false,
      duped_owners: '',
      notes: '',
      demand: '',
      description: '',
      health: '',
      tradable: false
    });
};

const handleSaveEdit = () => {

    // Save the changes to the changelog
    console.log('Saving changes to changelog:', changelogToEdit);
    const body = {
      name: changelogToEdit.name,
      type: changelogToEdit.type,
      cash_value: changelogToEdit.cash_value,
      duped_value: changelogToEdit.duped_value,
      price: changelogToEdit.price,
      is_limited: changelogToEdit.is_limited,
      duped_owners: changelogToEdit.duped_owners || 'N/A',
      notes: changelogToEdit.notes,
      demand: changelogToEdit.demand,
      description: changelogToEdit.description,
      health: changelogToEdit.health,
      tradable: changelogToEdit.tradable,
    };

    // Make sure to set the correct headers for the request
    fetch(`https://api3.jailbreakchangelogs.xyz/items/update?id=` + changelogToEdit.id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Tell the server we're sending JSON
      },
      body: JSON.stringify(body),  // The body needs to be a JSON string
    })
    .then(response => response.json())
    .then(data => {
      console.log('Updated item:', data);
    })
    .catch(error => {
      console.error('Error updating item:', error);
    });

    // Update the changelogs array in the state
    const updatedChangelogs = seasons.map(log => 
      log.id === changelogToEdit.id? changelogToEdit : log
    );
    setSeasons(updatedChangelogs);

    sessionStorage.removeItem('items') // Update cache

    // Close the dialog
    setOpenEditDialog(false);

    // Reset form state after saving
    setChangelogToEdit({
      id: null,
      name: '',
      type: '',
      cash_value: '',
      duped_value: '',
      price: '',
      is_limited: false,
      duped_owners: '',
      notes: '',
      demand: '',
      description: '',
      health: '',
      tradable: false
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
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={changelogToEdit.name}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            value={changelogToEdit.type}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, type: e.target.value })}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Cash Value"
            value={changelogToEdit.cash_value}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, cash_value: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Duped Value"
            value={changelogToEdit.duped_value}
            onChange={(e) => setChangelogToEdit({ ...changelogToEdit, duped_value: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            value={changelogToEdit.price}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, price: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={changelogToEdit.is_limited}
                onChange={(e) => setChangelogToEdit({...changelogToEdit, is_limited: e.target.checked })}
                color="primary"
              />
            }
            label="Is Limited"
          />\
          <TextField
            label="Duped Owners"
            value={changelogToEdit.duped_owners}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, duped_owners: e.target.value })}
            fullWidth
            multiline
            margin="normal"
          />
          <TextField
            label="Notes"
            value={changelogToEdit.notes}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, notes: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Demand"
            value={changelogToEdit.demand}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, demand: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={changelogToEdit.description}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, description: e.target.value })}
            fullWidth
            multiline
            margin="normal"
          />
          <TextField
            label="Health"
            value={changelogToEdit.health}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, health: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={changelogToEdit.tradable}
                onChange={(e) => setChangelogToEdit({...changelogToEdit, tradable: e.target.checked })}
                color="primary"
              />
            }
            label="Tradable"
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
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={changelogToEdit.name}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            value={changelogToEdit.type}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, type: e.target.value })}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Cash Value"
            value={changelogToEdit.cash_value}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, cash_value: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Duped Value"
            value={changelogToEdit.duped_value}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, duped_value: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            value={changelogToEdit.price}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, price: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={changelogToEdit.is_limited}
                onChange={(e) => setChangelogToEdit({...changelogToEdit, is_limited: e.target.checked })}
                color="primary"
              />
            }
            label="Is Limited"
          />
          <TextField
            label="Duped Owners"
            value={changelogToEdit.duped_owners}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, duped_owners: e.target.value })}
            fullWidth
            multiline
            margin="normal"
          />
          <TextField
            label="Notes"
            value={changelogToEdit.notes}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, notes: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Demand"
            value={changelogToEdit.demand}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, demand: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={changelogToEdit.description}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, description: e.target.value })}
            fullWidth
            multiline
            margin="normal"
          />
          <TextField
            label="Health"
            value={changelogToEdit.health}
            onChange={(e) => setChangelogToEdit({...changelogToEdit, health: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={changelogToEdit.tradable}
                onChange={(e) => setChangelogToEdit({...changelogToEdit, tradable: e.target.checked })}
                color="primary"
              />
            }
            label="Tradable"
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
