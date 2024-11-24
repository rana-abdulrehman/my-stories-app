import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import useStory from '../../hooks/useStory';
import { UserContext } from '../../context/UserContext';

interface Story {
  _id: string;
  title: string;
  content: string;
  author: { name: string; image: string }; 
  createdAt: string;
  status: 'pending' | 'rejected' | 'approved';
}

const CreatePostPage: React.FC = () => {
  const { user, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [editingPost, setEditingPost] = useState<null | string>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const { stories, addStory, updateStory, deleteStory } = useStory();
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get<Story[]>('http://localhost:5000/api/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response.data.forEach((story) => {
          if (!stories.some((s) => s._id === story._id)) {
            addStory(story);
          }
        });
      } catch (error: any) {
        console.error(error.response?.data || 'An error occurred while fetching user posts.');
      }
    };
    fetchUserPosts();
  }, [navigate, addStory, stories]);

  // if (!isLoggedIn) {
  //   return <Navigate to="/login" />;
  // }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !editorRef.current?.innerHTML.trim()) {
      setMessage('Title and content are required.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const url = editingPost
        ? `http://localhost:5000/api/posts/edit/${editingPost}`
        : 'http://localhost:5000/api/posts/create';

      const response = await axios.post<{ _id: string }>(
        url,
        {
          title,
          content: editorRef.current.innerHTML,
          author: user?.id || '', // Send the user's ID as the author
         
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newStory: Story = {
        _id: response.data._id,
        title,
        content: editorRef.current.innerHTML,
        author: {
          name: user?.name || '',
          image: user?.image || '', 
        },
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      if (editingPost) {
        updateStory(editingPost, newStory);
        toast.success('Post updated successfully!');
      } else {
        addStory(newStory);
        toast.success('Post created successfully!');
      }

      setTitle('');
      if (editorRef.current) editorRef.current.innerHTML = '';
      setEditingPost(null);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'An error occurred');
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFormat = (style: 'fontWeight' | 'fontStyle' | 'textDecoration') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    const span = document.createElement('span');

    if (style === 'fontWeight') {
      span.style.fontWeight = 'bold';
    } else if (style === 'fontStyle') {
      span.style.fontStyle = 'italic';
    } else if (style === 'textDecoration') {
      span.style.textDecoration = 'underline';
    }

    span.appendChild(selectedText);
    range.insertNode(span);

    selection.removeAllRanges();
  };

  const loadPostForEditing = async (postId: string) => {
    try {
      setEditLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get<{ title: string; content: string }>(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { title, content } = response.data;
      setTitle(title);
      if (editorRef.current) editorRef.current.innerHTML = content;
      setEditingPost(postId);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Unable to load post for editing');
      toast.error('Unable to load post for editing');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      deleteStory(postId);
      toast.success('Post deleted successfully!');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Unable to delete post');
      toast.error('Unable to delete post');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
        <p className='text-xl font-bold text-gray-800 group-hover:text-blue-500 transition-all'>Hi {user?.name || 'User'} </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Notification
          <span className="inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
            {stories.filter((story) => story.status === 'pending').length}
          </span>
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-4">
        {editingPost ? 'Edit Your Story' : 'Create a New Story'}
      </h1>
      <form onSubmit={handleSubmitPost}>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 mb-4 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div
          ref={editorRef}
          contentEditable
          className="w-full p-2 mb-4 border rounded min-h-[100px] outline-none"
        ></div>
        <div className="space-x-2 mb-4">
          <button
            type="button"
            onClick={() => handleFormat('fontWeight')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => handleFormat('fontStyle')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => handleFormat('textDecoration')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Underline
          </button>
        </div>
        {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Submitting...' : editingPost ? 'Update Post' : 'Submit'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Stories</h2>
        {stories.map((story) => (
          <div key={story._id} className="border p-4 mb-4">
            <h3 className="text-xl font-semibold">{story.title}</h3>
            <p className="text-gray-700">{story.content}</p>
            <div className="flex items-center gap-3 mt-4">
              <p className="text-xs text-gray-400">BY {story.author.name || 'Unknown'}</p>
              <span className="text-sm text-gray-400">
                {format(new Date(story.createdAt), 'MMMM dd, yyyy')}
              </span>
              <span
                className={`text-sm ${
                  story.status === 'approved'
                    ? 'text-green-600'
                    : story.status === 'rejected'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {story.status.toUpperCase()}
              </span>
            </div>
            <div className="space-x-2 mt-2">
              <button
                onClick={() => loadPostForEditing(story._id)}
                className="bg-yellow-600 text-white px-4 py-2 rounded"
                disabled={editLoading}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePost(story._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
                disabled={deleteLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePostPage;