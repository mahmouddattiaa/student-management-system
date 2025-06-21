import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
    return ( <
        AuthProvider >
        <
        Router >
        <
        div className = "app" >
        <
        Routes >
        <
        Route path = "/"
        element = { < Navigate to = "/dashboard" / > }
        /> <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/register"
        element = { < Register / > }
        /> <
        Route path = "/dashboard"
        element = { < Dashboard / > }
        /> { /* Add more routes as you build out the application */ } <
        /Routes> <
        /div> <
        /Router> <
        /AuthProvider>
    );
}

export default App;