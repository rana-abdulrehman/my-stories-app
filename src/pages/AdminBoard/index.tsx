import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Submission {
  _id: string;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'disapproved';
  author: {
    name: string;
    image?: string;
  };
  createdAt: string;
}

const AdminBoard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get<Submission[]>('http://localhost:5000/api/posts/pending', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmissions(response.data);
      } catch (error: any) {
        console.error(error.response?.data || 'An error occurred while fetching submissions.');
        setError(error.response?.data || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [navigate]);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.put(`http://localhost:5000/api/posts/approve/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmissions((prevSubmissions) =>
        prevSubmissions.filter((submission) => submission._id !== id)
      );
    } catch (error: any) {
      console.error(error.response?.data || 'An error occurred while approving the post.');
    }
  };

  const handleDisapprove = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.put(`http://localhost:5000/api/posts/disapprove/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmissions((prevSubmissions) =>
        prevSubmissions.filter((submission) => submission._id !== id)
      );
    } catch (error: any) {
      console.error(error.response?.data || 'An error occurred while disapproving the post.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p>Error: {error}</p>
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
        >
          Notification
          <span className="inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
            {submissions.length}
          </span>
        </button>
      </div>
      {submissions.map((submission) => (
        <div key={submission._id} className="border p-4 mb-4">
          <h2 className="text-2xl font-semibold">{submission.title}</h2>
          <p className="text-gray-700">{submission.content}</p>
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