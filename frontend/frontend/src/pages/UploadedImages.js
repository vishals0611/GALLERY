import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function UploadedImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('http://localhost:8000/gallery/');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setImages(data.images || []);
      } catch (err) {
        console.error('Fetch images error', err);
        setImages([]);
      }
    };
    fetchImages();
  }, []);

  const handleGenerateAI = async (img, idx) => {
    setLoading(l => ({ ...l, [img.id]: true }));
    try {
      const res = await fetch(`http://localhost:8000/gallery/${img.id}/generate-description`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data.ai_description) {
        setImages(prev =>
          prev.map((item, i) =>
            i === idx ? { ...item, aidescription: data.ai_description } : item
          )
        );
      } else {
        alert('Failed to get AI description');
      }
    } catch {
      alert('Failed to reach server');
    }
    setLoading(l => ({ ...l, [img.id]: false }));
  };

  return (
    <div className="container">
      
      <h2>Uploaded Images</h2>
      {images.length === 0 ? (
        <p>No images found</p>
      ) : (
        <div className="image-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {images.map((img, idx) => (
            <div key={img.id || idx} className="image-item" style={{ textAlign: 'center' }}>
              {img.path && (
                <img
                  src={`http://localhost:8000/${img.path}`}
                  alt={img.description || "uploaded-image"}
                  width="200"
                  style={{ borderRadius: '8px', border: '1px solid #ccc' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
              <p>{img.description}</p>
              {img.aidescription ? (
                <p><em>{img.aidescription}</em></p>
              ) : (
                <button
                  className="btn-secondary"
                  disabled={!!loading[img.id]}
                  onClick={() => handleGenerateAI(img, idx)}
                  style={{ marginTop: 8, marginBottom: 8 }}
                >
                  {loading[img.id] ? 'Generating...' : 'Generate AI Description'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        className="btn-primary"
        style={{ marginTop: '20px' }}
        onClick={() => navigate('/upload')}
      >
        Upload More
      </button>
    </div>
  );
}
