// src/pages/SignupPage.tsx
import React from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

const SignupPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>
      <TextField label="Username" fullWidth margin="normal" />
      <TextField label="Password" type="password" fullWidth margin="normal" />
      <Button variant="contained" color="primary">
        Sign Up
      </Button>
    </Container>
  );
};

export default SignupPage;