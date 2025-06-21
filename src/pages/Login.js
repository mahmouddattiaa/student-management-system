import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
        const [formData, setFormData] = useState({
            username: '',
            password: ''
        });
        const [loading, setLoading] = useState(false);

        const { login, error, clearError } = useAuth();
        const navigate = useNavigate();

        const { username, password } = formData;

        const onChange = (e) => {
            clearError();
            setFormData({...formData, [e.target.name]: e.target.value });
        };

        const onSubmit = async(e) => {
            e.preventDefault();
            setLoading(true);

            const success = await login(formData);
            setLoading(false);

            if (success) {
                navigate('/dashboard');
            }
        };

        return ( <
            div className = "login-container" >
            <
            div className = "login-form" >
            <
            h2 > Student Management System < /h2> <
            h3 > Login < /h3>

            {
                error && < div className = "alert alert-danger" > { error } < /div>}

                <
                form onSubmit = { onSubmit } >
                    <
                    div className = "form-group" >
                    <
                    label > Username or Email < /label> <
                    input
                type = "text"
                name = "username"
                value = { username }
                onChange = { onChange }
                required
                    /
                    >
                    <
                    /div>

                <
                div className = "form-group" >
                    <
                    label > Password < /label> <
                    input
                type = "password"
                name = "password"
                value = { password }
                onChange = { onChange }
                required
                    /
                    >
                    <
                    /div>

                <
                button type = "submit"
                disabled = { loading } > { loading ? 'Logging in...' : 'Login' } <
                    /button> <
                    /form>

                <
                p >
                    Don 't have an account? <a href="/register">Register</a> <
                    /p> <
                    /div> <
                    /div>
            );
        };

        export default Login;