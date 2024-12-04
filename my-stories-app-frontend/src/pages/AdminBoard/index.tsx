import { Submission } from '@/types';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Notifications from '../../components/Notifications';
import { UserContext } from '../../context/UserContext';
import { FetchNotificationsApi } from '../../endPoints/get.endpoints';
import { FetchPendingPostsApi } from '../../endPoints/post.endPoints';
import { ApprovePendingPostsApi, DisapprovePendingPostsApi } from '../../endPoints/put.endPoints';

const AdminBoard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const {unreadCount, setUnreadCount} =useContext(UserContext); 
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  if (!token) {
    navigate('/login');
  }

  useEffect(() => {  
    FetchNotificationsApi({ token })
      .then((response: any) => {
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n: any) => !n.read).length);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    FetchPendingPostsApi({ token })
      .then(response => {
        setSubmissions(response.data);
      })
      .catch(error => {
        console.error(error.response?.data || 'An error occurred while fetching submissions.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);


  const handleApprove = (id: string) => {
    if (!token) {
      navigate('/login');
    }
    ApprovePendingPostsApi({
      token,
      id,
    })
      .then(response => {
        setSubmissions(response.data.posts);
        toast.success('Post has Approved!');
      })
      .catch(error => {
        console.error(error.response?.data || 'An error occurred while approving the post.');
      });
  };

  const handleDisapprove = (id: string) => {
    if (!token) {
      navigate('/login');
    }
    DisapprovePendingPostsApi({
      token,
      id,
    })
      .then(response => {
        setSubmissions(response.data.posts);
        toast.error('Post has Disapproved!');
      })
      .catch(error => {
        console.error(error.response?.data || 'An error occurred while disapproving the post.');
      });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Admin Board</h1>
        <button
          type="button"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          Notification
          <span className="inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
            {unreadCount}
          </span>
        </button>
      </div>
      {showNotifications && <Notifications />}
      {submissions.map((submission) => (
        <div key={submission._id} className="border p-4 mb-4">
          <h2 className="text-2xl font-semibold">{submission.title}</h2>
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: submission.content }}
          />
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <img
              src={submission.author.image || 'https://cdn-icons-png.flaticon.com/128/1177/1177568.png'}
              alt="Author"
              className="w-10 h-10 rounded-full"
            />
            <p className="text-xs text-gray-400">BY {submission.author.name}</p>
            <span className="text-sm text-gray-400">
              {new Date(submission.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="space-x-2 mt-4">
            <button
              onClick={() => handleApprove(submission._id)}
              className={`bg-green-600 text-white px-4 py-2 rounded ${submission.status === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={submission.status === 'approved'}
            >
              Approve
            </button>
            <button
              onClick={() => handleDisapprove(submission._id)}
              className={`bg-red-600 text-white px-4 py-2 rounded ${submission.status === 'disapproved' ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={submission.status === 'disapproved'}
            >
              Disapprove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminBoard;