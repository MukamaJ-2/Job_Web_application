// Import React and routing-related modules.
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute'; // A component that ensures only users with appropriate roles can access certain routes.

// Public Pages - these routes can be accessed by anyone, no authentication required.
import Home from '../pages/Home'; // Home page component.
import Jobs from '../pages/Jobs'; // Job listings component.
import Login from '../pages/auth/Login'; // Login page component.
import Register from '../pages/auth/Register'; // Register page component.

// Employer Pages - these routes are restricted to users with an "employer" role.
import EmployerDashboard from '../pages/employer/Dashboard'; // Dashboard for employers.
import PostJob from '../pages/employer/PostJob'; // Page for posting a new job.
import ManageJobs from '../pages/employer/ManageJobs'; // Page for managing jobs posted by the employer.
import ManageApplications from '../pages/employer/ManageApplications'; // Page for reviewing job applications.

// Job Seeker Pages - these routes are restricted to users with a "jobseeker" role.
import JobSeekerDashboard from '../pages/jobseeker/Dashboard'; // Dashboard for job seekers.
import MyApplications from '../pages/jobseeker/MyApplications'; // Page to view the jobseeker's applications.
import SavedJobs from '../pages/jobseeker/SavedJobs'; // Page to view saved job listings.
import Profile from '../pages/jobseeker/Profile'; // Page for job seekers to view and edit their profiles.

// Admin Pages - these routes are restricted to users with an "admin" role.
import AdminDashboard from '../pages/admin/Dashboard'; // Admin dashboard page.
import ManageUsers from '../pages/admin/ManageUsers'; // Page for managing platform users.
import ManageJobPostings from '../pages/admin/ManageJobPostings'; // Page for managing job postings.

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            {/* These routes can be accessed by anyone, no authentication or roles required. */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Employer Routes */}
            {/* Routes restricted to users with the "employer" role. */}
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
            {/* Routes restricted to users with the "jobseeker" role. */}
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
            {/* Routes restricted to users with the "admin" role. */}
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

// Export the routes so they can be used in the main application.
export default AppRoutes;
