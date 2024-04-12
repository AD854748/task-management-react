import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Board.css'; // Import CSS file for styling
import { isVisible } from '@testing-library/user-event/dist/utils';

const initialState = {
  "TO_DO": [],
  "IN_PROGRESS": [],
  "QA": [],
  "HOLD": [],
  "COMPLETED": []
};

const Home = () => {
  const [columns, setColumns] = useState(initialState);
  const [selectedTicket, setSelectedTicket] = useState(null); // State to manage selected ticket for modal
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [visible,setVisible]= useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false); // State to control visibility of create modal
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    assigned_to: '',
    assignee: '',
    status: 'TO_DO',
    priority: 'P1',
    visible:true
  });
 useEffect(() => {
  // Fetch ticket data from API
  axios.get('http://127.0.0.1:8000/story/all/')
    .then(response => {
      // Organize tickets into columns based on their status
      const updatedColumns = { ...initialState };
      response.data.forEach(ticket => {
        if (ticket.status in updatedColumns  && ticket.is_visible) {
          // Check if the ticket with the same ID already exists in the column
          const existingTicketIndex = updatedColumns[ticket.status].findIndex(existingTicket => existingTicket.id === ticket.id);
          if (existingTicketIndex === -1) {
            // Ticket with the same ID does not exist, so add it to the column
            updatedColumns[ticket.status].push(ticket);
          } else {
            // Ticket with the same ID already exists, update it instead (if needed)
            updatedColumns[ticket.status][existingTicketIndex] = ticket;
          }
        }
      });
      setColumns(updatedColumns);
    })
    .catch(error => {
      console.error('Error fetching tickets:', error);
    });
}, []);


  // Function to handle click on a ticket
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status);
    setPriority(ticket.priority);
  };

  // Function to handle status change
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  // Function to handle priority change
  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  // Function to save changes and close the modal
  const saveChanges = async(path) => {
    console.log("selected tecket is ...",selectedTicket)
    // Update ticket status and priority on server
    try{
    const response = await fetch(`http://127.0.0.1:8000/story/${selectedTicket.id}/`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        
        title: selectedTicket?.title,
        description:selectedTicket?.description,
        assigned_to: selectedTicket?.assigned_to,
        assignee: selectedTicket?.assignee,
        status: status ? status :selectedTicket?.status,
        priority:priority? priority:selectedTicket?.priority,
        is_visible:path == "delete"?false:true
    })
  });
  console.log("res is..",response?.status)
  console.log("res is..11111",response?.body)
  const data = await response.json();
  console.log("data is ..",data)
  window.location.reload();
  setVisible(true);
}
  catch(error){
    console.error('Error updating ticket:', error?.response?.data);
    setVisible(true)
  }
    // axios.put(`http://127.0.0.1:8000/story/${selectedTicket.id}/`, {
    //   headers: {
    //     'Content-Type': 'application/json'
    // },
   
    // })
    //   .then(response => {
    //     console.log('Ticket updated successfully');
    //     // Refresh the tickets data
    //     // You may want to reload the entire ticket data or just update the modified ticket
    //     // For simplicity, let's reload the entire data
    //     window.location.reload();
    //   })
    //   .catch(error => {
    //     console.error('Error updating ticket:', error?.response?.data);
    //   });
    // Close the modal
    setSelectedTicket(null);
  };

  // Function to close the modal without saving changes
  const closeModal = () => {
    setSelectedTicket(null);
  };
  const handleNewTicketChange = (event) => {
    const { name, value } = event.target;
    setNewTicket(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to create a new ticket
  const createTicket = () => {
    axios.post('http://127.0.0.1:8000/story/all/', newTicket)
      .then(response => {
        console.log('Ticket created successfully');
        // Refresh the tickets data
        // You may want to reload the entire ticket data or just add the new ticket
        // For simplicity, let's reload the entire data
        window.location.reload();
      })
      .catch(error => {
        console.error('Error creating ticket:', error);
      });
    // Close the create modal
    setShowCreateModal(false);
    // Reset newTicket state to clear the form fields
    setNewTicket({
      title: '',
      description: '',
      assigned_to: '',
      assignee: '',
      status: 'TO_DO',
      priority: 'P1'
    });
  };

  // Function to open create modal
  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  // Function to close create modal
  const closeCreateModal = () => {
    setShowCreateModal(false);
  };


  return (
    <div className="board">
      <h1 style={{alignItems:"center",textAlign:"center"}}>Shopclues Jira DashBoard</h1>
       <button onClick={openCreateModal} style={{backgroundColor:'green',borderRadius:'8px',marginBottom:'10px',color:"white",padding:'5px 8px'}}>Create New Ticket</button>
      <table>
        <thead>
          <tr>
            <th>To Do</th>
            <th>In Progress</th>
            <th>QA</th>
            <th>Hold</th>
            <th>COMPLETED</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(Math.max(...Object.values(columns).map(column => column.length)))].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(columns).map(columnKey => (
                <td key={columnKey}>
                  {columns[columnKey][rowIndex] && (
                    <div className="ticket" onClick={() => handleTicketClick(columns[columnKey][rowIndex])}>
                      <h3>{columns[columnKey][rowIndex].title}</h3>
                      <p>{columns[columnKey][rowIndex].description}</p>
                      {/* Add additional ticket details here */}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for displaying ticket details */}
      {selectedTicket && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3 > Title : {selectedTicket.title}</h3>
            <p> Description :{selectedTicket.description}</p>
            <p> Assigned to  :{selectedTicket.assigned_to}</p>
            <p> Assignee :{selectedTicket.assignee}</p>
            <label htmlFor="status">Status:</label>
            <select id="status" value={status} onChange={handleStatusChange}>
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="QA">QA</option>
              <option value="HOLD">Hold</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <label htmlFor="priority">Priority:</label>
            <select id="priority" value={selectedTicket?.priority} onChange={handlePriorityChange}>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              {/* Add additional priority levels as needed */}
            </select>
            <div style={{display:'flex',justifyContent:"space-around",alignContent:'center',padding:'5px'}}>
            <button style={{backgroundColor:'green',borderRadius:'8px',margin:'10px',color:"white"}} onClick={()=>saveChanges("change")}>Save Changes</button>
            <button style={{backgroundColor:'red',borderRadius:'8px',margin:'10px',color:"white"}} onClick={()=>{
              setVisible(false);
              saveChanges("delete")}}>Delete ticket</button>

            </div>
          </div>
        </div>
      )}
        {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeCreateModal}>&times;</span>
            <h2>Create New Ticket</h2>
            <form >
              <label htmlFor="title" style={{alignSelf:"flex-start"}}>Title:</label>
              <input type="text" id="title" name="title" title='title' value={newTicket.title} onChange={handleNewTicketChange} />

              <label htmlFor="description">Description:</label>
              <input type="text" id="description" name="description" value={newTicket.description} onChange={handleNewTicketChange} />

              <label htmlFor="assigned_to">Assigned To:</label>
              <input type="text" id="assigned_to" name="assigned_to" value={newTicket.assigned_to} onChange={handleNewTicketChange} />

              <label htmlFor="assignee">Assignee:</label>
              <input type="text" id="assignee" name="assignee" value={newTicket.assignee} onChange={handleNewTicketChange} />

              <label htmlFor="status">Status:</label>
              <select id="status" name="status" value={newTicket.status} onChange={handleNewTicketChange}>
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="QA">QA</option>
                <option value="HOLD">Hold</option>
                <option value="DONE">Done</option>
              </select>

              <label htmlFor="priority">Priority:</label>
              <select id="priority" name="priority" value={newTicket.priority} onChange={handleNewTicketChange}>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                {/* Add additional priority levels as needed */}
              </select>
               <div >
              <button style={{backgroundColor:'green',borderRadius:'8px',marginBottom:'10px',color:"white"}} type="button" onClick={createTicket}>Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
