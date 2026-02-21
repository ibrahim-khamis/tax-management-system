import React, { useState, useEffect } from "react";
import { getusers, createuser, updateuser, deleteuser, createbusiness } from "../api/api";
import "./Users.css";
import { useNavigate } from "react-router-dom";





const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showView, setShowView] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  // form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("not paid");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getusers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to load users. Check console.");
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setAddress("");
    setUsername("");
    setPassword("");
    setBusinessName("");
    setBusinessType("");
    setLocation("");
    setStatus("not paid");
  };

  const handleCreateUser = async () => {
    if (!firstName || !lastName || !address || !username.trim() || !password || !businessName) {
      alert("Please fill all required fields!");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    try {
      // create user
      const userRes = await createuser({
        first_name: firstName,
        last_name: lastName,
        address: address,
        username: username.trim(),
        password: password,
        role: "customer",
      });

      const userId = userRes.data.id;

      // create business
      await createbusiness({
        user: userId,
        business_name: businessName,
        business_type: businessType,
        location: location,
        status: status,
      });

      alert("User created successfully!");
      setShowForm(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error("Failed to create user:", err);
      if (err.response && err.response.data) {
        alert("Backend error: " + JSON.stringify(err.response.data));
      } else {
        alert("Failed to create user. Check console for details.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteuser(id);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user. Check console.");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setAddress(user.address);
    setShowEdit(true);
  };

const handleUpdateUser = async () => {
  try {
    await updateuser(editUser.id, {
      first_name: firstName,
      last_name: lastName,
      address: address,
    });

    alert("User updated successfully");
    setShowEdit(false);
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert("Failed to update user. Check console.");
  }
};



  const handleView = (user) => {
    setViewUser(user);
    setShowView(true);
  };

  return (
   <div className="users-page">

    {/* HEADER */}
    <div className="users-header">
      <h2>Tax Payers</h2>

      <div className="buttons-right">
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Add New User
        </button>
      </div>
    </div>



      {/* ADD USER FORM */}
      {showForm && (
        <div className="form-container">
          <h3>Create New User</h3>
          <div className="form-group">
            <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
            <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <input type="text" placeholder="Business Name" value={businessName} onChange={e => setBusinessName(e.target.value)} />
            <input type="text" placeholder="Business Type" value={businessType} onChange={e => setBusinessType(e.target.value)} />
            <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="not paid">Not Paid</option>
              <option value="paid">Paid</option>
            </select>
            <button className="submit-btn" onClick={handleCreateUser}>Submit</button>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit User</h3>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
            <button onClick={handleUpdateUser}>Update</button>
            <button onClick={() => { setShowEdit(false); resetForm(); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* VIEW USER MODAL */}
      {showView && viewUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>User Details</h3>
            <p><b>First Name:</b> {viewUser.first_name}</p>
            <p><b>Last Name:</b> {viewUser.last_name}</p>
            <p><b>Username:</b> {viewUser.username}</p>
            <p><b>Address:</b> {viewUser.address}</p>
            <p><b>Role:</b> {viewUser.role}</p>
            <p><b>Business:</b> {viewUser.businesses && viewUser.businesses.map(b => `${b.business_name} (${b.status})`).join(", ")}</p>
            <button onClick={() => setShowView(false)}>Close</button>
          </div>
        </div>
      )}

      {/* USERS TABLE */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Business</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td>{u.address}</td>
                <td>{u.businesses && u.businesses.map(b => b.business_name).join(", ")}</td>
                <td className="actions">
                  <button className="view" onClick={() => handleView(u)}>View</button>
                  <button className="edit" onClick={() => handleEdit(u)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



export default Users;
