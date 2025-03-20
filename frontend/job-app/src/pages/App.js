import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import store from './store';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import Dashboard from './components/Dashboard';
import EmployerDashboard from './components/employer/EmployerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import CreateJob from './components/employer/CreateJob';
import EditJob from './components/employer/EditJob';
import { useSelector } from 'react-redux';

const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/jobs" element={<JobList />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      {({ user }) => {
                        if (user?.role === 'employer') {
                          return <EmployerDashboard />;
                        } else if (user?.role === 'admin') {
                          return <AdminDashboard />;
                        } else {
                          return <Dashboard />;
                        }
                      }}
                    </PrivateRoute>
                  }
                />

                {/* Employer Routes */}
                <Route
                  path="/employer/*"
                  element={
                    <PrivateRoute allowedRoles={['employer']}>
                      <Routes>
                        <Route path="jobs/create" element={<CreateJob />} />
                        <Route path="jobs/:id/edit" element={<EditJob />} />
                      </Routes>
                    </PrivateRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </LocalizationProvider>
      </Provider>
    </StrictMode>
  );
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  // If children is a function, call it with user prop
  if (typeof children === 'function') {
    return children({ user });
  }

  // Otherwise, render children directly
  return children;
};

export default App;
