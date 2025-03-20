import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useThunkAPI } from '../store/thunkAPI';
import { authSlice } from '../store/authSlice';
import ErrorMessage from '../components/ErrorMessage';
import '../assets/css/Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const thunkAPI = useThunkAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form submitted with:', { name, email, password, confirmPassword });

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      console.error('Passwords do not match');
      return;
    }

    try {
      console.log('Attempting to register user...');
      const response = await thunkAPI.fetch(authSlice.actions.register({ name, email, password }));
      console.log('Registration response:', response);

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      dispatch(authSlice.actions.registerSuccess(data));
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default Register;
