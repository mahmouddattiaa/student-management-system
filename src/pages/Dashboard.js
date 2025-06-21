import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);

    // Fetch user's courses based on their role
    useEffect(() => {
        const fetchCourses = async() => {
            if (!isAuthenticated || !user) {
                return;
            }

            try {
                let response;

                if (user.role === 'admin') {
                    // Admin sees all courses
                    response = await axios.get('http://localhost:5000/api/courses');
                } else if (user.role === 'instructor') {
                    // Instructor sees their assigned courses
                    // Assuming instructor's ID is stored or can be fetched
                    const instructorResponse = await axios.get(`http://localhost:5000/api/instructors?userId=${user.id}`);
                    if (instructorResponse.data.length > 0) {
                        const instructorId = instructorResponse.data[0].id;
                        response = await axios.get(`http://localhost:5000/api/courses?instructorId=${instructorId}`);
                    }
                } else {
                    // Student sees enrolled courses
                    const studentResponse = await axios.get(`http://localhost:5000/api/students?userId=${user.id}`);
                    if (studentResponse.data.length > 0) {
                        const studentId = studentResponse.data[0].id;
                        response = await axios.get(`http://localhost:5000/api/students/${studentId}/courses`);
                    }
                }

                if (response) {
                    setCourses(response.data);
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [isAuthenticated, user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (isLoading || loading) {
        return <div className = "loading" > Loading... < /div>;
    }

    return ( <
        div className = "dashboard" >
        <
        header className = "dashboard-header" >
        <
        h1 > Student Management System < /h1> <
        div className = "user-info" > {
            user && ( <
                >
                <
                span > Welcome, { user.username }({ user.role }) < /span> <
                button onClick = { handleLogout }
                className = "logout-btn" >
                Logout <
                /button> <
                />
            )
        } <
        /div> <
        /header>

        <
        main className = "dashboard-main" >
        <
        section className = "dashboard-section" >
        <
        h2 > Dashboard < /h2>

        <
        div className = "dashboard-content" > {
            user && user.role === 'admin' && ( <
                div className = "admin-dashboard" >
                <
                h3 > Administration < /h3> <
                div className = "admin-actions" >
                <
                button onClick = {
                    () => navigate('/users') } > Manage Users < /button> <
                button onClick = {
                    () => navigate('/students') } > Manage Students < /button> <
                button onClick = {
                    () => navigate('/instructors') } > Manage Instructors < /button> <
                button onClick = {
                    () => navigate('/courses') } > Manage Courses < /button> <
                button onClick = {
                    () => navigate('/enrollments') } > Manage Enrollments < /button> <
                /div> <
                /div>
            )
        }

        {
            user && user.role === 'instructor' && ( <
                div className = "instructor-dashboard" >
                <
                h3 > Instructor Panel < /h3> <
                div className = "instructor-actions" >
                <
                button onClick = {
                    () => navigate('/my-courses') } > My Courses < /button> <
                button onClick = {
                    () => navigate('/grades') } > Manage Grades < /button> <
                button onClick = {
                    () => navigate('/attendance') } > Track Attendance < /button> <
                /div> <
                /div>
            )
        }

        {
            user && user.role === 'student' && ( <
                div className = "student-dashboard" >
                <
                h3 > Student Portal < /h3> <
                div className = "student-actions" >
                <
                button onClick = {
                    () => navigate('/my-courses') } > My Courses < /button> <
                button onClick = {
                    () => navigate('/my-grades') } > View Grades < /button> <
                button onClick = {
                    () => navigate('/course-registration') } > Register
                for Courses < /button> <
                /div> <
                /div>
            )
        }

        <
        div className = "courses-section" >
        <
        h3 > Courses < /h3> {
            courses.length > 0 ? ( <
                div className = "courses-list" > {
                    courses.map(course => ( <
                        div key = { course.id }
                        className = "course-card" >
                        <
                        h4 > { course.code }: { course.title } < /h4> <
                        p > { course.description } < /p> <
                        div className = "course-details" >
                        <
                        span > Credits: { course.credits } < /span> {
                            course.instructor_name && ( <
                                span > Instructor: { course.instructor_name } < /span>
                            )
                        } {
                            course.department_name && ( <
                                span > Department: { course.department_name } < /span>
                            )
                        } <
                        /div> <
                        button onClick = {
                            () => navigate(`/courses/${course.id}`) } >
                        View Details <
                        /button> <
                        /div>
                    ))
                } <
                /div>
            ) : ( <
                p > No courses available. < /p>
            )
        } <
        /div> <
        /div> <
        /section> <
        /main>

        <
        footer className = "dashboard-footer" >
        <
        p > & copy; 2024 Student Management System - Cairo University < /p> <
        /footer> <
        /div>
    );
};

export default Dashboard;