import React, { useState } from "react";
import { useNotes } from "../context/NotesContext";
import "../styles/notes.css";

const Notes = () => {
  const {
    folders, selectedFolder, setSelectedFolder,
    selectedFile, setSelectedFile,
    addFolder, deleteFolder,
    addFile, updateFileContent, deleteFile
  } = useNotes();

  const [newFolder, setNewFolder] = useState("");
  const [newFile, setNewFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [zoom, setZoom] = useState(1);
  const [folderError, setFolderError] = useState("");
  const [fileError, setFileError] = useState("");

  const validateFolderName = (name) => {
    if (!name.trim()) {
      setFolderError("Folder name cannot be empty");
      return false;
    }
    if (folders.some(folder => folder.name.toLowerCase() === name.toLowerCase())) {
      setFolderError("Folder already exists");
      return false;
    }
    return true;
  };

  const validateFileName = (name) => {
    if (!name.trim()) {
      setFileError("File name cannot be empty");
      return false;
    }
    const currentFolder = folders.find(f => f.name === selectedFolder);
    if (currentFolder?.files.some(file => file.name.toLowerCase() === name.toLowerCase())) {
      setFileError("File already exists in this folder");
      return false;
    }
    return true;
  };

  const handleAddFolder = () => {
    if (validateFolderName(newFolder)) {
      addFolder(newFolder.trim());
      setNewFolder("");
      setFolderError("");
    }
  };

  const handleAddFile = () => {
    if (validateFileName(newFile)) {
      addFile(selectedFolder, newFile.trim());
      setNewFile("");
      setFileError("");
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setFileContent(file.content);
    setZoom(1);
  };

  const handleSave = () => {
    if (!selectedFile) return;
    updateFileContent(selectedFolder, selectedFile.name, fileContent);
  };

  const increaseZoom = () => setZoom(prev => Math.min(prev + 0.1, 3));
  const decreaseZoom = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setZoom(1);

  return (
    <div className="notes-page">
      <div className="folders-panel">
        <h3>Folders</h3>
        <div className="input-group">
          <input
            value={newFolder}
            onChange={(e) => {
              setNewFolder(e.target.value);
              setFolderError("");
            }}
            placeholder="New folder name"
            className="notes-input"
            onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
          />
          <button 
            onClick={handleAddFolder} 
            className="btn-primary"
            disabled={!newFolder.trim()}
          >
            Add
          </button>
        </div>
        {folderError && <div className="error-message">{folderError}</div>}
        
        <ul className="folders-list">
          {folders.map(folder => (
            <li key={folder.name} className="list-item">
              <span
                className={`folder-name ${folder.name === selectedFolder ? "selected" : ""}`}
                onClick={() => setSelectedFolder(folder.name)}
              >
                {folder.name}
              </span>
              {folder.name !== "Default" && (
                <button 
                  onClick={() => deleteFolder(folder.name)} 
                  className="delete-btn"
                  aria-label="Delete folder"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="files-panel">
        <h3>Files in "{selectedFolder}"</h3>
        <div className="input-group">
          <input
            value={newFile}
            onChange={(e) => {
              setNewFile(e.target.value);
              setFileError("");
            }}
            placeholder="New file name"
            className="notes-input"
            onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
          />
          <button 
            onClick={handleAddFile} 
            className="btn-primary"
            disabled={!newFile.trim()}
          >
            Add
          </button>
        </div>
        {fileError && <div className="error-message">{fileError}</div>}
        
        <ul className="files-list">
          {folders.find(f => f.name === selectedFolder)?.files.map(file => (
            <li key={file.name} className="list-item">
              <span
                className={`file-name ${selectedFile?.name === file.name ? "selected" : ""}`}
                onClick={() => handleFileSelect(file)}
              >
                {file.name}
              </span>
              <button 
                onClick={() => deleteFile(selectedFolder, file.name)} 
                className="delete-btn"
                aria-label="Delete file"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="editor-panel">
        {selectedFile ? (
          <>
            <div className="editor-header">
              <h3>Editing: {selectedFile.name}</h3>
              <div className="zoom-controls">
                <button onClick={decreaseZoom} aria-label="Zoom out">−</button>
                <span>{Math.round(zoom * 100)}%</span>
                <button onClick={increaseZoom} aria-label="Zoom in">+</button>
                <button onClick={resetZoom} aria-label="Reset zoom">Reset</button>
              </div>
            </div>
            
            <div className="preview-container" style={{ transform: `scale(${zoom})` }}>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="notes-textarea"
                placeholder="Start typing your notes here..."
              />
            </div>
            
            <div className="editor-footer">
              <button onClick={handleSave} className="btn-primary save-btn">
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>Select a file to view/edit its content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;