// frontend/src/pages/HomeBakerDashboard.js
import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Card, Table, Modal } from "react-bootstrap";
import axios from "axios";

function HomeBakerDashboard() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    bankDetails: "",
    addressProofs: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pastWorks, setPastWorks] = useState([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
    fetchPastWorks();
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/homebaker/profile", {
        headers: { "x-auth-token": token },
      });
      setProfile(res.data);
      setFormData({
        bankDetails: res.data.bankDetails || "",
        addressProofs: res.data.addressProofs || "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile");
    }
  };

  const fetchPastWorks = async () => {
    try {
      const res = await axios.get("/api/homebaker/pastworks", {
        headers: { "x-auth-token": token },
      });
      setPastWorks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch past works");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/homebaker/orders", {
        headers: { "x-auth-token": token },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders");
    }
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const onSubmitProfile = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.put("/api/homebaker/profile", formData, {
        headers: { "x-auth-token": token },
      });
      setProfile(res.data);
      setMessage("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  const onSubmitUpload = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (selectedFiles.length === 0) {
      setError("Please select at least one image to upload");
      return;
    }

    const form = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      form.append("images", selectedFiles[i]);
    }

    try {
      await axios.post("/api/homebaker/upload", form, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Images uploaded successfully");
      setSelectedFiles([]);
      setUploadModal(false);
      fetchPastWorks(); // Refresh past works
    } catch (err) {
      console.error(err);
      setError("Failed to upload images");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Home Baker Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {/* Profile Information */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Profile Information</Card.Title>
          <p>
            <strong>Name:</strong> {profile ? profile.name : "Loading..."}
          </p>
          <p>
            <strong>Email:</strong> {profile ? profile.email : "Loading..."}
          </p>
          <p>
            <strong>Subscription Expiry:</strong>{" "}
            {profile && profile.subscriptionExpiry
              ? new Date(profile.subscriptionExpiry).toLocaleDateString()
              : "Not Subscribed"}
          </p>
        </Card.Body>
      </Card>

      {/* Update Profile Form */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Update Profile</Card.Title>
          <Form onSubmit={onSubmitProfile}>
            <Form.Group className="mb-3" controlId="formBankDetails">
              <Form.Label>Bank Details</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter bank details"
                name="bankDetails"
                value={formData.bankDetails}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAddressProofs">
              <Form.Label>Address Proofs</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address proofs (URL or file path)"
                name="addressProofs"
                value={formData.addressProofs}
                onChange={onChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Upload Past Works */}
      <Button
        variant="success"
        onClick={() => setUploadModal(true)}
        className="mb-4">
        Upload Past Works
      </Button>

      {/* Past Works Table */}
      <h3>Past Works</h3>
      {pastWorks.length === 0 ? (
        <p>No past works uploaded yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Description</th>
              <th>Uploaded At</th>
            </tr>
          </thead>
          <tbody>
            {pastWorks.map((work, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={work.imageUrl}
                    alt={`Past Work ${index + 1}`}
                    style={{ width: "100px" }}
                  />
                </td>
                <td>{work.description || "N/A"}</td>
                <td>{new Date(work.uploadedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Orders Placed to Home Baker */}
      <h3 className="mt-5">Orders Placed to You</h3>
      {orders.length === 0 ? (
        <p>No orders placed to you yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Cake Details</th>
              <th>Status</th>
              <th>Estimated Arrival</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.cakeDetails}</td>
                <td>{order.status}</td>
                <td>
                  {order.estimatedArrival
                    ? new Date(order.estimatedArrival).toLocaleString()
                    : "N/A"}
                </td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>
                  {/* Action Buttons to Update Status */}
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      // Implement status update modal or inline editing
                      // For simplicity, we'll skip implementation here
                      alert("Status update feature coming soon!");
                    }}>
                    Update Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Upload Modal */}
      <Modal show={uploadModal} onHide={() => setUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Past Works</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmitUpload}>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Select Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={onFileChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Upload
            </Button>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default HomeBakerDashboard;
