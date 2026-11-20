import React from 'react';
import '../styles/components.css';


const FilePreview = ({ file }) => {
  if (!file) return <p>No file selected</p>;

  const fileType = file.name.split('.').pop();

  return (
    <div className="file-preview">
      <h3>Preview: {file.name}</h3>
      {fileType === 'pdf' && (
        <embed src={URL.createObjectURL(file)} width="100%" height="400px" />
      )}
      {fileType === 'txt' && (
        <textarea readOnly value={file.content || ''} rows={15} style={{width:'100%'}}></textarea>
      )}
      {fileType === 'docx' && <p>DOCX preview not implemented. Download to view.</p>}
      <button onClick={()=>window.open(URL.createObjectURL(file), '_blank')}>Download / Open</button>
      <button onClick={()=>window.print()}>Print</button>
    </div>
  );
};

export default FilePreview;
