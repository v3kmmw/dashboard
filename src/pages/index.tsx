import * as React from 'react';
import Typography from '@mui/material/Typography';

export default function DashboardPage() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'
    }
  return <Typography>Welcome to the Toolpad orders!</Typography>;
}
