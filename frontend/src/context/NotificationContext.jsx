import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (msg) => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), message: msg, read: false }
    ]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
