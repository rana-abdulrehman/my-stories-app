import { Story } from '@/types';
import { format } from 'date-fns';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createPost, updatePost } from '../../api';
import Notifications from '../../components/Notifications';
import { UserContext } from '../../context/UserContext';
import { FetchPostByIdApi, FetchUserPostsApi } from '../../endPoints/get.endpoints';
import { handleFormat } from '../../utils/formatting';
import { DeletePostApi } from '../../endPoints/delete.endpoints';

const CreatePostPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editingPostRef = useRef<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const editLoadingRef = useRef<boolean>(false);
  const deleteLoadingRef = useRef<boolean>(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    FetchUserPostsApi({
      token: token
    })
      .then(response => {
        console.log(response);
        setStories(response.data);
      })
      .catch(error => {
        console.error('Error fetching user posts:', error);
      })
  }, []);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = titleRef.current?.value.trim();
    const content = editorRef.current?.innerHTML.trim();

    if (!title || !content) {
      toast.error('Title and content are required.');
      return;
    }
    const plainTextContent = content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/&nbsp;/gi, ' ')
      .replace(/<(\/)?span[^>]*>/gi, '')
      .replace(/<(\/)?strong>/gi, '')
      .replace(/<(\/)?em>/gi, '')
      .replace(/<(\/)?u>/gi, '');

    try {
      const postData = {
        title,
        content: plainTextContent,
        author: user?.id || '',
      };

      const response = editingPostRef.current
        ? await updatePost(editingPostRef.current, postData)
        : await createPost(postData);

      const newStory: Story = {
        _id: response._id,
        title,
        content: plainTextContent,
        author: {
          name: user?.name || '',
          image: user?.image || '',
        },
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      if (editingPostRef.current) {
        setStories(stories.map((story) => (story._id === editingPostRef.current ? newStory : story)));
        toast.success('Post updated successfully!');
      } else {
        setStories([...stories, newStory]);
        toast.success('Post created successfully!');
      }

      if (titleRef.current) titleRef.current.value = '';
      if (editorRef.current) editorRef.current.innerHTML = '';
      editingPostRef.current = null;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'An error occurred while editing story');
    }
  };

  const handleEditPost = (postId: string) => {
    editLoadingRef.current = true;
    toast.success('Post load for editing')
    FetchPostByIdApi({
      token : token,
      postId : postId
    })
      .then(response => {
        const post = response.data;
        if (titleRef.current) titleRef.current.value = post.title;
        if (editorRef.current) editorRef.current.innerHTML = post.content;
        editingPostRef.current = postId;
      }).catch(error => {
        toast.error('Unable to load post for editing');
      }).finally(() => {
        editLoadingRef.current = false;
      })
  };

  const handleDeletePost = (postId: string) => {
    deleteLoadingRef.current = true;
    DeletePostApi({
      token : token,
      postId : postId
    }).then((response :any)=>{
      setStories(response.data.posts);
      toast.success('Post deleted successfully!');
    }).catch(error=>{
      toast.error('Unable to delete post');
    }).finally(()=>{
      deleteLoadingRef.current = false;
    })
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
          onClick={() => setShowNotifications(!showNotifications)}
        >
          Notification
          <span className="inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
            {stories.filter((story) => story.status === 'pending').length}
          </span>
        </button>
      </div>
      {showNotifications && <Notifications />}
      <h1 className="text-4xl font-bold mb-4">
        {editingPostRef.current ? 'Edit Your Story' : 'Create a New Story'}
      </h1>
      <form onSubmit={handleSubmitPost}>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 mb-4 border rounded"
          ref={titleRef}
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingPostRef.current ? 'Update Post' : 'Submit'}
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
                className={`text-sm ${story.status === 'approved'
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
                onClick={() => handleEditPost(story._id)}
                className="bg-yellow-600 text-white px-4 py-2 rounded"
                disabled={editLoadingRef.current}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePost(story._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
                disabled={deleteLoadingRef.current}
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