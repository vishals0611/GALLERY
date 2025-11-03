import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleUpload = async () => {
    const userId = localStorage.getItem('userId');


    if (!userId || userId === 'undefined') {
      alert('Please login first.');
      return;
    }

    if (!file) {
      alert('Please choose a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description);
    formData.append('userId', userId);  

    try {
      const res = await fetch('http://localhost:8000/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setDescription(data.image.aidescription || '');
        setFile(null);
        setDescription('');
       alert('Image uploaded successfully!');
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed - server error');
    }
  };

  return (
    <div className="upload-page">
     
      <div className="upload-card">
        <h2 className="upload-title">📸 Upload Your Image</h2>
        <p className="upload-subtitle">Add a photo and a short description</p>

        <div className="upload-field">
          <input
            type="file"
            id="fileInput"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input"
            accept='image/*'
          />
        </div>

        <textarea
          placeholder="AI-generated description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />

        <button className="btn-primary w-full" onClick={handleUpload}>
          Upload Image
        </button>

        <button
          className="btn-secondary w-full"
          style={{ marginTop: '10px' }}
          onClick={() => navigate('/uploaded-images')}
        >
          View Uploaded Images
        </button>
      </div>
    </div>
  );
}
