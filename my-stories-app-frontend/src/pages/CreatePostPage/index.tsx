import { Story, StoryFormData } from '@/types';
import { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import { FetchNotificationsApi, FetchPostByIdApi, FetchUserPostsApi } from '../../endPoints/get.endpoints';
import { DeletePostApi } from '../../endPoints/delete.endpoints';
import { createPost, updatePost } from '../../api';
import Notifications from '../../components/Notifications';
import { RichTextEditor} from '../CreatePostPage/RichTextEditor';
import { StoryCard } from '../CreatePostPage/StoryCard';

const CreatePostPage = () => {
  const { user } = useContext(UserContext);
  const [stories, setStories] = useState<Story[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState({
    edit: false,
    delete: false,
  });

  const token = localStorage.getItem('token');

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StoryFormData>({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (token) {
      FetchNotificationsApi({ token })
        .then((response:any) => {
          setNotifications(response.data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      FetchUserPostsApi({ token })
        .then((response) => {
          setStories(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user posts:', error);
        });
    }
  }, [token]);

  const onSubmit = async (data: StoryFormData) => {
    const plainTextContent = data.content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/&nbsp;/gi, ' ')
      .replace(/<(\/)?span[^>]*>/gi, '')
      .replace(/<(\/)?strong>/gi, '')
      .replace(/<(\/)?em>/gi, '')
      .replace(/<(\/)?u>/gi, '');

    try {
      const postData = {
        title: data.title,
        content: plainTextContent,
        author: user?.id || '',
      };

      const response = editingId
        ? await updatePost(editingId, postData)
        : await createPost(postData);

      const newStory: Story = {
        _id: response._id,
        title: data.title,
        content: plainTextContent,
        author: {
          name: user?.name || '',
          image: user?.image || '',
        },
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      if (editingId) {
        setStories(stories.map((story) => (story._id === editingId ? newStory : story)));
        toast.success('Post updated successfully!');
        setEditingId(null);
      } else {
        setStories([...stories, newStory]);
        toast.success('Post created successfully!');
      }

      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'An error occurred while saving the story');
    }
  };

  const handleEditPost = async (postId: string) => {
    setIsLoading((prev) => ({ ...prev, edit: true }));
    try {
      const response = await FetchPostByIdApi({ token, postId });
      const post = response.data;
      setValue('title', post.title);
      setValue('content', post.content);
      setEditingId(postId);
      toast.success('Post loaded for editing');
    } catch (error) {
      toast.error('Unable to load post for editing');
    } finally {
      setIsLoading((prev) => ({ ...prev, edit: false }));
    }
  };

  const handleDeletePost = async (postId: string) => {
    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      const response : any = await DeletePostApi({ token, postId });
      setStories(response.data.posts);
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Unable to delete post');
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-xl font-bold text-gray-800 group-hover:text-blue-500 transition-all">
            Hi {user?.name || 'User'}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          Notification
          <span className="inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
            {notifications.filter((notification) => notification.read === 'false').length}
          </span>
        </button>
      </div>

      {showNotifications && <Notifications />}

      <h1 className="text-4xl font-bold mb-4">
        {editingId ? 'Edit Your Story' : 'Create a New Story'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Title"
                className={`w-full p-2 border rounded ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <Controller
          name="content"
          control={control}
          rules={{ required: 'Content is required' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              error={!!errors.content}
            />
          )}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Post' : 'Submit'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Stories</h2>
        {stories.map((story) => (
          <StoryCard
            key={story._id}
            story={story}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default CreatePostPage;

