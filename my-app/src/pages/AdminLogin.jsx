import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminLogin({setIsLoggedIn}) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessage(''); // Form dəyişdiyində səhv mesajını təmizləyir
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasiya
    if (formData.username === 'admin' && formData.password === 'admin') {
      setErrorMessage('');
      setIsLoggedIn(true)
      navigate('/adminpanel');
    } else {
      setErrorMessage('No such user exists.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{marginTop:'100px', marginBottom:'150px'}}>
      <Form onSubmit={handleSubmit} className="w-25">
        <h3 className="text-center mb-3 text-white">Admin Login</h3>
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </div>
  );
}

export default AdminLogin;