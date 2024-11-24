import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: { name: string };
  createdAt: string;
  status: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Post>(`http://localhost:5000/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-lg">{post.content}</p>
      <p className="text-sm text-gray-500">By {post.author.name} on {new Date(post.createdAt).toLocaleString()}</p>
      <p className="text-sm text-gray-500">Status: {post.status}</p>
    </div>
  );
};

export default PostDetail;