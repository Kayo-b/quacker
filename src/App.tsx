import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import Login from './components/Login'
import Register from './components/Register';
import Reset from './components/Reset';
import Dashboard from './components/Dashboard';
import logo from './logo.svg';
import './style/App.css';
import Bookmarks from './components/Bookmarks';

function App() {
  return (
   
    <BrowserRouter>
     <div className="App">
      <div className="sidebar">
      <Sidebar />
      </div>
      
      <div className="center-container">
      <Navbar />
      <Routes>
        <Route 
        path="/" 
        element={<Login/>}
        />   
        <Route 
        path="/register" 
        element={<Register/>}
        />
        <Route 
        path="/reset" 
        element={<Reset/>}
        />        
        <Route
        path="/homepage/"
        element={<Homepage/>}
        />
        <Route
        path="/bookmarks/"
        element={<Bookmarks/>}
        />
        
      </Routes>
      </div>
      </div>
    </BrowserRouter>
    

  );
}

export default App;
