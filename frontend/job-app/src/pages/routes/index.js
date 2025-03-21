import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Public Pages
import Home from '../pages/Home';
import Jobs from '../pages/Jobs';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Employer Pages
import EmployerDashboard from '../pages/employer/Dashboard';
import PostJob from '../pages/employer/PostJob';
import ManageJobs from '../pages/employer/ManageJobs';
import ManageApplications from '../pages/employer/ManageApplications';

// Job Seeker Pages
import JobSeekerDashboard from '../pages/jobseeker/Dashboard';
import MyApplications from '../pages/jobseeker/MyApplications';
import SavedJobs from '../pages/jobseeker/SavedJobs';
import Profile from '../pages/jobseeker/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageJobPostings from '../pages/admin/ManageJobPostings';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Employer Routes */}
            <Route
                path="/employer/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['employer']}>
                        <EmployerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/employer/post-job"
                element={
                    <ProtectedRoute allowedRoles={['employer']}>
                        <PostJob />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/employer/manage-jobs"
                element={
                    <ProtectedRoute allowedRoles={['employer']}>
                        <ManageJobs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/employer/applications"
                element={
                    <ProtectedRoute allowedRoles={['employer']}>
                        <ManageApplications />
                    </ProtectedRoute>
                }
            />

            {/* Job Seeker Routes */}
            <Route
                path="/jobseeker/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                        <JobSeekerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/jobseeker/applications"
                element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                        <MyApplications />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/jobseeker/saved-jobs"
                element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                        <SavedJobs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/jobseeker/profile"
                element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <ManageUsers />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/job-postings"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <ManageJobPostings />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;