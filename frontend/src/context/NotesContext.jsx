import React, { createContext, useState, useContext } from "react";

const NotesContext = createContext();
export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const [folders, setFolders] = useState([{ name: "Default", files: [] }]);
  const [selectedFolder, setSelectedFolder] = useState("Default");
  const [selectedFile, setSelectedFile] = useState(null);

  // FOLDER FUNCTIONS
  const addFolder = (name) => {
    if (!name.trim()) return;
    if (folders.some(f => f.name === name)) return;
    setFolders([...folders, { name, files: [] }]);
    setSelectedFolder(name);
  };

  const deleteFolder = (name) => {
    setFolders(folders.filter(f => f.name !== name));
    if (selectedFolder === name) setSelectedFolder(folders[0]?.name || "Default");
  };

  // FILE FUNCTIONS
  const addFile = (folderName, fileName, content = "") => {
    setFolders(folders.map(f => {
      if (f.name === folderName) {
        if (f.files.some(file => file.name === fileName)) return f;
        const updatedFolder = { ...f, files: [...f.files, { name: fileName, content }] };
        return updatedFolder;
      }
      return f;
    }));
    setSelectedFile({ name: fileName, folder: folderName });
  };

  const deleteFile = (folderName, fileName) => {
    setFolders(folders.map(f => {
      if (f.name === folderName) {
        return { ...f, files: f.files.filter(file => file.name !== fileName) };
      }
      return f;
    }));
    if (selectedFile?.name === fileName && selectedFile?.folder === folderName) setSelectedFile(null);
  };

  const updateFileContent = (folderName, fileName, content) => {
    setFolders(folders.map(f => {
      if (f.name === folderName) {
        return {
          ...f,
          files: f.files.map(file =>
            file.name === fileName ? { ...file, content } : file
          ),
        };
      }
      return f;
    }));
  };

  // NEW FUNCTION: Save AI content to selected file
  const saveToFile = (folderName, fileName, content) => {
    updateFileContent(folderName, fileName, content);
  };

  return (
    <NotesContext.Provider
      value={{
        folders,
        selectedFolder,
        setSelectedFolder,
        selectedFile,
        setSelectedFile,
        addFolder,
        deleteFolder,
        addFile,
        updateFileContent,
        deleteFile,
        saveToFile,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
