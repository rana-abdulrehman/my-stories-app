
import React from 'react';

const AdminBoard: React.FC = () => {
  const submissions = [
    { id: 1, title: 'Submission 1', content: 'This is the content of submission 1.' },
    { id: 2, title: 'Submission 2', content: 'This is the content of submission 2.' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Admin Board</h1>
      {submissions.map((submission) => (
        <div key={submission.id} className="border p-4 mb-4">
          <h2 className="text-2xl font-semibold">{submission.title}</h2>
          <p className="text-gray-700">{submission.content}</p>
          <div className="space-x-2 mt-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded">Disapprove</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminBoard;