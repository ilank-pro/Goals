import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Tree, TreeNode } from 'react-organizational-chart';
import OrgNode from '../components/OrgNode';
import PersonFormDialog from '../components/PersonFormDialog';
import { personApi } from '../services/api';

const OrgTreePage = () => {
  const [orgTree, setOrgTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isNewPerson, setIsNewPerson] = useState(true);
  
  // Fetch organization tree data
  const fetchOrgTree = async () => {
    try {
      setLoading(true);
      const data = await personApi.getOrgTree();
      setOrgTree(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching org tree:', err);
      setError('Failed to load organization tree. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrgTree();
  }, []);
  
  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };
  
  const handleAddPerson = () => {
    setIsNewPerson(true);
    setSelectedNode(null);
    setOpenDialog(true);
  };
  
  const handleEditPerson = () => {
    if (selectedNode) {
      setIsNewPerson(false);
      setOpenDialog(true);
    }
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleSavePerson = async (personData) => {
    try {
      if (isNewPerson) {
        await personApi.createPerson(personData);
      } else {
        await personApi.updatePerson(selectedNode.id, personData);
      }
      
      // Refresh the tree
      fetchOrgTree();
      setOpenDialog(false);
    } catch (err) {
      console.error('Error saving person:', err);
      setError('Failed to save person data. Please try again.');
    }
  };
  
  // Recursive function to render the tree
  const renderTree = (nodes) => {
    if (!nodes || nodes.length === 0) return null;
    
    return nodes.map(node => (
      <TreeNode 
        key={node.id} 
        label={<OrgNode node={node} onNodeSelect={handleNodeSelect} />}
      >
        {node.subordinates && node.subordinates.length > 0 && renderTree(node.subordinates)}
      </TreeNode>
    ));
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Organization Structure
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAddPerson}
            sx={{ mr: 1 }}
          >
            Add Person
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleEditPerson}
            disabled={!selectedNode}
          >
            Edit Selected
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}
      
      <Paper className="org-tree-container" sx={{ p: 3, overflowX: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : orgTree.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No organization data available. Add a person to get started.
            </Typography>
          </Box>
        ) : (
          <Tree 
            lineWidth="2px"
            lineColor="#bdbdbd"
            lineBorderRadius="10px"
            label={<Typography variant="h6">Organization</Typography>}
          >
            {renderTree(orgTree)}
          </Tree>
        )}
      </Paper>
      
      {/* Person Form Dialog */}
      <PersonFormDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSavePerson}
        person={isNewPerson ? null : selectedNode}
        isNew={isNewPerson}
      />
    </Container>
  );
};

export default OrgTreePage; 