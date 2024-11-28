import { forwardRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, error }, ref) => {
    const handleFormat = (command: string) => {
      document.execCommand(command, false);
    };

    return (
      <div className="space-y-2">
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => handleFormat('underline')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Underline
          </button>
        </div>
        <div
          ref={ref}
          contentEditable
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          className={`w-full p-2 border rounded min-h-[100px] outline-none ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

