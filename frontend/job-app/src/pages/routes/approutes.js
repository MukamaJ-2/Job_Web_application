// Import required modules and components.
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Routing components from react-router-dom.
import { useSelector } from 'react-redux'; // Redux hook to access the store state.
import Login from '../components/auth/Login'; // Login component for user authentication.
import Register from '../components/auth/Register'; // Register component for new users.
import JobSeekerDashboard from '../components/jobseeker/Dashboard'; // Dashboard for job seekers.
import EmployerDashboard from '../components/employer/Dashboard'; // Dashboard for employers.
import JobListings from '../components/jobs/JobListings'; // Component displaying available job listings.
import JobDetails from '../components/jobs/JobDetails'; // Component for viewing details of a specific job.
import Profile from '../components/profile/Profile'; // Component for viewing and editing user profiles.
import PostJob from '../components/employer/PostJob'; // Component for employers to post jobs.
import Applications from '../components/employer/Applications'; // Component for employers to view job applications.
import MyApplications from '../components/jobseeker/MyApplications'; // Component for job seekers to view their applications.
import SavedJobs from '../components/jobseeker/SavedJobs'; // Component for job seekers to view saved jobs.
import ProtectedRoute from './ProtectedRoute'; // Higher-order component for protecting routes based on user roles.

// Define all application routes.
const AppRoutes = () => {
    // Access authentication status and user information from the Redux store.
    const { isAuthenticated, user } = useSelector(state => state.auth);

    return (
        <Routes>
            {/* Public routes that anyone can access */}
            <Route path="/" element={<JobListings />} /> // Default homepage showing job listings.
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} /> // Redirects to dashboard if already authenticated.
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} /> // Redirects to dashboard if already authenticated.
            <Route path="/jobs" element={<JobListings />} /> // Job listings route.
            <Route path="/jobs/:id" element={<JobDetails />} /> // Route for viewing details of a specific job.

            {/* Protected routes that require authentication */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    {user?.role === 'employer' ? <EmployerDashboard /> : <JobSeekerDashboard />}
                    // Renders different dashboards based on user role.
                </ProtectedRoute>
            } />

            {/* Routes specific to job seekers */}
            <Route path="/my-applications" element={
                <ProtectedRoute roleRequired="jobseeker">
                    <MyApplications /> // Only accessible to job seekers.
                </ProtectedRoute>
            } />
            <Route path="/saved-jobs" element={
                <ProtectedRoute roleRequired="jobseeker">
                    <SavedJobs /> // Only accessible to job seekers.
                </ProtectedRoute>
            } />

            {/* Routes specific to employers */}
            <Route path="/post-job" element={
                <ProtectedRoute roleRequired="employer">
                    <PostJob /> // Only accessible to employers.
                </ProtectedRoute>
            } />
            <Route path="/applications" element={
                <ProtectedRoute roleRequired="employer">
                    <Applications /> // Only accessible to employers.
                </ProtectedRoute>
            } />

            {/* Common protected route for both job seekers and employers */}
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile /> // Profile page for authenticated users.
                </ProtectedRoute>
            } />
        </Routes>
    );
};

// Export the routes component for use in the main application.
export default AppRoutes;
