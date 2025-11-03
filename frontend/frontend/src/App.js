import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Upload from './pages/Upload';
import UploadedImages from './pages/UploadedImages';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/uploaded-images" element={<UploadedImages />} />
      </Routes>
    </Router>
  );
}
