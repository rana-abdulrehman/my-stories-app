import { Story } from '@/types';
import { format } from 'date-fns';

interface StoryCardProps {
  story: Story;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: {
    edit: boolean;
    delete: boolean;
  };
}

export const StoryCard = ({ story, onEdit, onDelete, isLoading }: StoryCardProps) => {
  return (
    <div className="border p-4 mb-4">
      <h3 className="text-xl font-semibold">{story.title}</h3>
      <div
        className="text-gray-700"
        dangerouslySetInnerHTML={{ __html: story.content }}
      />
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
          onClick={() => onEdit(story._id)}
          className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isLoading.edit}
        >
          {isLoading.edit ? 'Loading...' : 'Edit'}
        </button>
        <button
          onClick={() => onDelete(story._id)}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isLoading.delete}
        >
          {isLoading.delete ? 'Loading...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};