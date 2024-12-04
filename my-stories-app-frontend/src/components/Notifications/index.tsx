import { Notification } from "@/types";
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../../context/UserContext";
import { FetchNotificationsApi } from '../../endPoints/get.endpoints';
import { HandleNotificationClickApi } from "../../endPoints/put.endPoints";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const {unreadCount, setUnreadCount} =useContext(UserContext); 
  const token = localStorage.getItem('token');

  useEffect(()=>{
    console.log(unreadCount)
  },[unreadCount])

  useEffect(() => {
    FetchNotificationsApi({ token })
      .then((response) => {
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n) => !n.read).length);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, [token]);

  const handleNotificationClick = (notification: Notification) => {
    HandleNotificationClickApi({
      token,
      notificationId: notification._id,
    })
      .then((response) => {
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n : any) => !n.read).length);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="absolute top-15 right-0 bg-white border border-gray-200 shadow-lg p-4 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      {notifications.map((notification) => (
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