export const handleFormat = (style: any) => {
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