import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Story {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image: string;
  };
}

const LandingPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response : any = await axios.get('http://localhost:5000/api/posts');
        setStories(response.data);
      } catch (error) {
        const axiosError : any = error;
        console.error(axiosError.response?.data || 'An error occurred while fetching stories.');
        // Optionally, you can set an error state or display an error message to users.
      }
    };

    fetchStories();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 font-[sans-serif]">
        <div className="relative overflow-hidden">
          <div className="max-w-screen-xl mx-auto py-16 px-4 sm:px-6 lg:py-32 lg:px-8">
            <div className="relative z-10 text-center lg:text-left">
              <h1 className="text-4xl tracking-tight leading-10 font-extrabold text-white sm:text-5xl sm:leading-none md:text-6xl lg:text-7xl">
                Welcome to
                <br className="xl:hidden" />
                <span className="text-indigo-400"> StoryStream</span>
              </h1>
              <p className="max-w-md mx-auto text-lg text-indigo-400 sm:text-xl mt-4 md:mt-6 md:max-w-3xl">
                Every story deserves a stream to flow—immerse yourself in creativity, connect through words, and let your voice be heard on StoryStream.
              </p>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://cdn.pixabay.com/photo/2022/11/08/07/53/generated-7577945_1280.jpg"
              alt="Delicious Food"
            />
          </div>
        </div>
      </div>
      <div className="bg-white sm:px-6 px-4 py-10 font-sans">
        <div className="max-w-xl mx-auto">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 inline-block">LATEST STORIES</h2>
            <p className="text-gray-400 text-sm mt-4">
              Step into a world of fresh perspectives and captivating narratives. Explore the latest stories crafted by our talented community, spanning genres and themes that will ignite your imagination.
            </p>
          </div>
          <hr className="my-8" />
          <div className="grid gap-16">
            {stories.map((story) => (
              <div key={story.id} className="cursor-pointer rounded overflow-hidden group">
                <div>
                  <span className="text-sm block text-gray-400 mb-4">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-500 transition-all">
                    {story.title}
                  </h3>
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm">{story.content}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <img
                    src={story.author.image}
                    alt="Author"
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="text-xs text-gray-400">BY {story.author.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
