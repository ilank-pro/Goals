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
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [isNewPerson, setIsNewPerson] = useState(true);
  const [defaultParentId, setDefaultParentId] = useState('');
  
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
    // Toggle expansion when clicking on a node
    const nodeId = node.id;
    
    // If clicking the same node that's already selected
    if (selectedNode && selectedNode.id === nodeId) {
      // Toggle expansion state
      const newExpandedNodes = new Set(expandedNodes);
      if (newExpandedNodes.has(nodeId)) {
        newExpandedNodes.delete(nodeId);
      } else {
        newExpandedNodes.add(nodeId);
      }
      setExpandedNodes(newExpandedNodes);
    } else {
      // If selecting a new node, select it and expand it if not already expanded
      setSelectedNode(node);
      if (!expandedNodes.has(nodeId)) {
        const newExpandedNodes = new Set(expandedNodes);
        newExpandedNodes.add(nodeId);
        setExpandedNodes(newExpandedNodes);
      }
    }
  };
  
  const handleAddPerson = () => {
    setIsNewPerson(true);
    // Set the default parent ID to the selected node's ID if a node is selected
    setDefaultParentId(selectedNode ? selectedNode.id : '');
    setOpenDialog(true);
  };
  
  const handleEditPerson = () => {
    if (selectedNode) {
      setIsNewPerson(false);
      setDefaultParentId(''); // No default parent when editing
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
    
    return nodes.map(node => {
      const isExpanded = expandedNodes.has(node.id);
      const isNodeSelected = selectedNode && selectedNode.id === node.id;
      
      return (
        <TreeNode 
          key={node.id} 
          label={
            <OrgNode 
              node={node} 
              onNodeSelect={handleNodeSelect} 
              isSelected={isNodeSelected}
            />
          }
        >
          {/* Only render subordinates if the node is expanded */}
          {isExpanded && node.subordinates && node.subordinates.length > 0 && 
            renderTree(node.subordinates)}
        </TreeNode>
      );
    });
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
            nodePadding="5px"
            pathFunc="straight"
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
        defaultParentId={defaultParentId}
      />
    </Container>
  );
};

export default OrgTreePage; 