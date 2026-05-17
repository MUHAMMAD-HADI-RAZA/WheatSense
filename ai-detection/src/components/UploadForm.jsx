import React, { useState } from 'react';

function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
      <button type="submit">Detect Disease</button>
    </form>
  );
}

export default UploadForm;
