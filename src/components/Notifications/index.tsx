import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Notification {
  _id: string;
  type: string;
  postId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Notification[]>('http://localhost:5000/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${notification._id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(notifications.map(n => n._id === notification._id ? { ...n, read: true } : n));
      // Open portal with post details
      navigate(`/post/${notification.postId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Notifications</h1>
      {notifications.map(notification => (
        <div
          key={notification._id}
          className={`border p-4 mb-4 cursor-pointer ${notification.read ? 'bg-gray-100' : 'bg-white'}`}
          onClick={() => handleNotificationClick(notification)}
        >
          <p className="text-lg">{notification.message}</p>
          <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;