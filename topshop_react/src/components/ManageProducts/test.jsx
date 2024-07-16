import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Box, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const initialColumns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'price', headerName: 'Price', width: 150 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    renderCell: (params) => (
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => params.row.toggleExpand(params.row.id)}
      >
        {params.row.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    ),
  },
];

const initialRows = [
  { id: 1, name: 'Product A', price: 100 },
  { id: 2, name: 'Product B', price: 150 },
  { id: 3, name: 'Product C', price: 200 },
];

const CustomDataGrid = () => {
  const [rows, setRows] = useState(
    initialRows.map((row) => ({ ...row, isExpanded: false }))
  );

  const toggleExpand = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isExpanded: !row.isExpanded } : row
      )
    );
  };

  const columns = initialColumns.map((col) =>
    col.field === 'actions'
      ? {
          ...col,
          renderCell: (params) => (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => toggleExpand(params.row.id)}
            >
              {params.row.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          ),
        }
      : col
  );

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        autoHeight
        rowSelection={false}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        initialState={{
            pagination: {
            paginationModel: { page: 0, pageSize: 1}
            }
        }}
        pageSizeOptions={[1, 3]}
        components={{
          Row: (props) => (
            <>
              <div className="data-grid-row">
                {props.children}
              </div>
              <div className="expanded-row">
                <Collapse in={props.row.isExpanded} timeout="auto" unmountOnExit>
                  <Box margin={2} bgcolor="grey.100">
                    Expanded content for row {props.row.id}
                  </Box>
                </Collapse>
              </div>
            </>
          ),
        }}
      />
    </div>
  );
};

export default CustomDataGrid;
