import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
        const [formData, setFormData] = useState({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        const [loading, setLoading] = useState(false);
        const [passwordError, setPasswordError] = useState('');

        const { register, error, clearError } = useAuth();
        const navigate = useNavigate();

        const { username, email, password, confirmPassword } = formData;

        const onChange = (e) => {
            clearError();
            setPasswordError('');
            setFormData({...formData, [e.target.name]: e.target.value });
        };

        const onSubmit = async(e) => {
            e.preventDefault();

            // Check if passwords match
            if (password !== confirmPassword) {
                setPasswordError('Passwords do not match');
                return;
            }

            setLoading(true);

            const userData = {
                username,
                email,
                password,
                role: 'student' // Default role
            };

            const success = await register(userData);
            setLoading(false);

            if (success) {
                navigate('/dashboard');
            }
        };

        return ( <
                div className = "register-container" >
                <
                div className = "register-form" >
                <
                h2 > Student Management System < /h2> <
                h3 > Register < /h3>

                {
                    error && < div className = "alert alert-danger" > { error } < /div>} {
                        passwordError && < div className = "alert alert-danger" > { passwordError } < /div>}

                        <
                        form onSubmit = { onSubmit } >
                            <
                            div className = "form-group" >
                            <
                            label > Username < /label> <
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
                            label > Email < /label> <
                            input
                        type = "email"
                        name = "email"
                        value = { email }
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
                        minLength = "6"
                        required
                            /
                            >
                            <
                            /div>

                        <
                        div className = "form-group" >
                            <
                            label > Confirm Password < /label> <
                            input
                        type = "password"
                        name = "confirmPassword"
                        value = { confirmPassword }
                        onChange = { onChange }
                        minLength = "6"
                        required
                            /
                            >
                            <
                            /div>

                        <
                        button type = "submit"
                        disabled = { loading } > { loading ? 'Registering...' : 'Register' } <
                            /button> <
                            /form>

                        <
                        p >
                            Already have an account ? < a href = "/login" > Login < /a> <
                            /p> <
                            /div> <
                            /div>
                    );
                };

                export default Register;