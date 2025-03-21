import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import JobSeekerDashboard from '../components/jobseeker/Dashboard';
import EmployerDashboard from '../components/employer/Dashboard';
import JobListings from '../components/jobs/JobListings';
import JobDetails from '../components/jobs/JobDetails';
import Profile from '../components/profile/Profile';
import PostJob from '../components/employer/PostJob';
import Applications from '../components/employer/Applications';
import MyApplications from '../components/jobseeker/MyApplications';
import SavedJobs from '../components/jobseeker/SavedJobs';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<JobListings />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    {user?.role === 'employer' ? <EmployerDashboard /> : <JobSeekerDashboard />}
                </ProtectedRoute>
            } />

            {/* Job Seeker Routes */}
            <Route path="/my-applications" element={
                <ProtectedRoute roleRequired="jobseeker">
                    <MyApplications />
                </ProtectedRoute>
            } />
            <Route path="/saved-jobs" element={
                <ProtectedRoute roleRequired="jobseeker">
                    <SavedJobs />
                </ProtectedRoute>
            } />

            {/* Employer Routes */}
            <Route path="/post-job" element={
                <ProtectedRoute roleRequired="employer">
                    <PostJob />
                </ProtectedRoute>
            } />
            <Route path="/applications" element={
                <ProtectedRoute roleRequired="employer">
                    <Applications />
                </ProtectedRoute>
            } />

            {/* Common Protected Routes */}
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;