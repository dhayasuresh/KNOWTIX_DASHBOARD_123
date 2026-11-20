import React, { useState } from 'react';
import FilePreview from '../components/FilePreview';
import "../styles/pages.css"

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <div className="page">
      <h1>File Upload & Preview</h1>
      <input type="file" onChange={handleChange} />
      {file && <FilePreview file={file} />}
    </div>
  );
};

export default FileUpload;
