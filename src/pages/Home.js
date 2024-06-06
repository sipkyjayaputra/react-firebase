import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { db, storage } from '../firebaseConfig'; // Import your Firestore database and storage objects
import { getDocs, collection, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Import Storage functions
import { getUnixTime } from 'date-fns'; // Import date-fns to get the current Unix timestamp

const Home = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', image: null });

  const fetchUsers = async () => {
    try {
      const usersCollection = await getDocs(collection(db, 'users'));
      const userData = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleAddUser = async () => {
    try {
      // Generate a unique filename using current timestamp and original filename
      const uniqueFilename = `${getUnixTime(new Date())}_${newUser.image.name}`;
  
      // Upload the image file to Firebase Storage with the unique filename
      const storageRef = ref(storage, `images/${uniqueFilename}`);
      const uploadTask = uploadBytes(storageRef, newUser.image);
  
      // Wait for the upload to complete and get the download URL
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      // Create a new user object with the download URL and unique filename
      const newUserWithImage = { ...newUser, image: downloadURL, imageName: uniqueFilename };
  
      // Add the new user data to Firestore
      await addDoc(collection(db, 'users'), newUserWithImage);
  
      // Reset the form and close the modal
      setNewUser({ name: '', email: '', image: null });
      setShowAddModal(false);
  
      // Fetch users data to update the table
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  

const handleEditUser = async () => {
  try {
    if (selectedUser) {
      // Check if a new image file was selected
      if (newUser.image) {
      // Generate a unique filename using current timestamp and original filename
      const uniqueFilename = `${getUnixTime(new Date())}_${newUser.image.name}`;
  
        // Delete the old image from Firebase Storage
        const oldImageRef = ref(storage, `images/${selectedUser.imageName}`);
        await deleteObject(oldImageRef);
  
        // Upload the new image file to Firebase Storage with the generated filename
        const storageRef = ref(storage, `images/${uniqueFilename}`);
        const uploadTask = uploadBytes(storageRef, newUser.image);
  
        // Wait for the upload to complete and get the download URL
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);
  
        // Update the selectedUser object with the new image URL and file name
        selectedUser.image = downloadURL;
        selectedUser.imageName = uniqueFilename;
      }
  
      // Update the user data in Firestore
      await setDoc(doc(db, 'users', selectedUser.id), selectedUser);
  
      setShowEditModal(false);
      fetchUsers();
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

  
  

  const handleDeleteUser = async () => {
    try {
      await deleteDoc(doc(db, 'users', selectedUser.id));
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewUser({ ...newUser, image: e.target.files[0] });
    }
  };

  return (
    <div>
      <h2>CRUD Operations</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>Add</Button>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>Close</Button>
          <Button variant="primary" onClick={handleAddUser}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      
<Modal show={showEditModal} onHide={handleCloseEditModal}>
  <Modal.Header closeButton>
    <Modal.Title>Edit User</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" value={selectedUser ? selectedUser.name : ''} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={selectedUser ? selectedUser.email : ''} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
      </Form.Group>
      <Form.Group controlId="formImage">
        <Form.Label>Image</Form.Label>
        <Form.Control type="file" onChange={handleImageChange} />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseEditModal}>Close</Button>
    <Button variant="primary" onClick={handleEditUser}>Save Changes</Button>
  </Modal.Footer>
</Modal>


      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteUser}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <Table striped bordered hover>
    <thead>
        <tr>
        <th>#</th>
        <th>Name</th>
        <th>Email</th>
        <th>Image</th>
        <th>Action</th>
        </tr>
    </thead>
    <tbody>
        {users.map((user, index) => (
        <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td><img src={user.image} alt="User" style={{ width: '100px', height: 'auto' }} /></td>
            <td>
            <Button variant="info" size="sm" className="me-2" onClick={() => { setShowEditModal(true); setSelectedUser(user); }}>Edit</Button>
            <Button variant="danger" size="sm" onClick={() => { setShowDeleteModal(true); setSelectedUser(user); }}>Delete</Button>
            </td>
        </tr>
        ))}
    </tbody>
    </Table>

    </div>
  );
};

export default Home;

