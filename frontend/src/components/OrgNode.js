import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const OrgNode = ({ node, onNodeSelect, isSelected }) => {
  const navigate = useNavigate();
  
  const handleNodeClick = () => {
    onNodeSelect(node);
  };
  
  const handleNodeDoubleClick = () => {
    navigate(`/person/${node.id}`);
  };
  
  return (
    <Card 
      className="org-node" 
      onClick={handleNodeClick}
      onDoubleClick={handleNodeDoubleClick}
      sx={{ 
        minWidth: 200, 
        m: 1,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isSelected ? '2px solid orange' : 'none',
        boxShadow: isSelected ? 3 : 1,
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <PersonIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {node.name}
          </Typography>
        </Box>
        <Typography color="text.secondary" gutterBottom>
          {node.position}
        </Typography>
        
        {node.goals && node.goals.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Goals:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
              {node.goals.map(goal => (
                <Chip 
                  key={goal.id} 
                  icon={<TrackChangesIcon />} 
                  label={`${goal.name}: ${goal.current_value}/${goal.target}`}
                  size="small"
                  color={goal.is_locked ? "secondary" : "primary"}
                  variant={goal.is_locked ? "filled" : "outlined"}
                />
              ))}
            </Box>
          </Box>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {node.subordinates && node.subordinates.length > 0 
            ? `${node.subordinates.length} subordinates` 
            : 'No subordinates'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OrgNode; 