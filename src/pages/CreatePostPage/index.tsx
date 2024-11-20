import React, { useState } from 'react';
import axios from 'axios';

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/posts/create',
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      
    } catch (error) {
      const axiosError : any = error ;
      console.error(axiosError.response?.data || 'An error occurred');
      
    }
  };

  const handleFormat = (style: string) => {
    const contentInput = document.getElementById('content-input') as HTMLTextAreaElement;
    const selectionStart = contentInput.selectionStart ?? 0;
    const selectionEnd = contentInput.selectionEnd ?? 0;
    const selectedText = content.substring(selectionStart, selectionEnd);
    const formattedText = `<${style}>${selectedText}</${style}>`;

    setContent(
      content.substring(0, selectionStart) + formattedText + content.substring(selectionEnd)
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Create a New Story</h1>
      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 mb-4 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          id="content-input"
          placeholder="Content"
          rows={4}
          className="w-full p-2 mb-4 border rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="space-x-2 mb-4">
          <button
            type="button"
            onClick={() => handleFormat('b')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => handleFormat('i')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => handleFormat('u')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Underline
          </button>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
