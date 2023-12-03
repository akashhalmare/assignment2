// App.js
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './App.css';

function App() {
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Role',
      selector: row => row.role,
      sortable: true
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button onClick={() => handleEdit(row)}>Edit</button>
          <button onClick={() => handleDelete(row.id)}>Delete</button>
        </div>
      )
    }
  ];

  const [records, setRecords] = useState([]);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => response.json())
      .then(data => setRecords(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  function handleFilter(event) {
    const searchTerm = event.target.value.toLowerCase();
    const newData = records.filter(row => row.name.toLowerCase().includes(searchTerm));
    setRecords(newData);
  }

  function handleEdit(row) {
    // Open the edit form
    setEditRow(row);
  }

  function handleDelete(id) {
    // Assuming you want to confirm the deletion and update the data
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedRecords = records.filter(row => row.id !== id);
      setRecords(updatedRecords);
    }
  }

  const handleSave = () => {
    // Save the changes and update the records
    setRecords(prevRecords =>
      prevRecords.map(row => (row.id === editRow.id ? { ...row, ...editRow } : row))
    );

    // Close the edit form
    setEditRow(null);
  };

  return (
    <div className='container mt-5'>
      <div className='text-end'>
        <input type="text" onChange={handleFilter} placeholder="Search" />
      </div>
      <DataTable columns={columns} data={records} selectableRows fixedHeader pagination />

      {editRow && (
        <div className="overlay">
          <div className="edit-form">
            <h2>Edit Form</h2>
            <label>Name:</label>
            <input
              type="text"
              value={editRow.name}
              onChange={(e) => setEditRow({ ...editRow, name: e.target.value })}
            />
            <label>Email:</label>
            <input
              type="text"
              value={editRow.email}
              onChange={(e) => setEditRow({ ...editRow, email: e.target.value })}
            />
            <label>Role:</label>
            <input
              type="text"
              value={editRow.role}
              onChange={(e) => setEditRow({ ...editRow, role: e.target.value })}
            />
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
