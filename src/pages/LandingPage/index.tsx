// src/pages/LandingPage.tsx
import React from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';

const LandingPage: React.FC = () => {
  const stories = [
    { id: 1, title: 'Story 1', content: 'This is the content of story 1.' },
    { id: 2, title: 'Story 2', content: 'This is the content of story 2.' },
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to StoryApp
      </Typography>
      {stories.map((story) => (
        <Card key={story.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {story.title}
            </Typography>
            <Typography variant="body1">{story.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default LandingPage;