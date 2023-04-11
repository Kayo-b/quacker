import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Homepage from './components/Homepage'
import logo from './logo.svg';
import './App.css';
import Bookmarks from './components/Bookmarks';

function App() {
  return (
    <BrowserRouter>
      <Sidebar/>
      <Routes>
        <Route
        path="/homepage/"
        element={<Homepage/>}
        />
        <Route
        path="/bookmarks/"
        element={<Bookmarks/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
