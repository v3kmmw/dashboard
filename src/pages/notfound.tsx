import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        minHeight="50vh"
        textAlign="center"
      >
        <img
          src="https://cdn.jakobiis.xyz/nze0f6kli"
          alt="Not Found"
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            marginBottom: '1.5rem',
          }}
        />
        <Typography variant="h3" component="h1" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1">
          We couldn't find the page you were looking for.
        </Typography>
      </Box>
    </Container>
  );
}
