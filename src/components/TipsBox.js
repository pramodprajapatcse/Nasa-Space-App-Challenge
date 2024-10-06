// client/src/components/TipsBox.js

import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

function TipsBox() {
  const tips = [
    {
      title: 'Optimize Irrigation',
      link: 'https://example.com/optimize-irrigation',
      description: 'Learn how to efficiently manage your water usage to conserve resources and improve crop yields.',
    },
    {
      title: 'Pest Management',
      link: 'https://example.com/pest-management',
      description: 'Effective strategies to identify and control pests that threaten your crops.',
    },
    {
      title: 'Soil Health',
      link: 'https://example.com/soil-health',
      description: 'Maintain and improve soil fertility through best practices and sustainable techniques.',
    },
    // Add more tips as needed
  ];

  return (
    <Card className="mt-4">
      <Card.Header>Tips & Tricks</Card.Header>
      <ListGroup variant="flush">
        {tips.map((tip, index) => (
          <ListGroup.Item key={index}>
            <a href={tip.link} target="_blank" rel="noopener noreferrer">
              <strong>{tip.title}</strong>
            </a>
            <p>{tip.description}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default TipsBox;
