import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import Login from './components/Login'
import logo from './logo.svg';
import './style/App.css';
import Bookmarks from './components/Bookmarks';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      
      <Sidebar />
      <div className="center-container">
      <Navbar />
      <Routes>
        <Route 
        path="/" 
        element={<Login/>}
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
    </BrowserRouter>
    </div>

  );
}

export default App;
