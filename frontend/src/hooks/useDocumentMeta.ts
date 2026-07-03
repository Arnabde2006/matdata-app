import { useEffect } from 'react';

export const useDocumentMeta = (title: string, description: string) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | MatdataApp`;
    }

    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = description;
        document.head.appendChild(newMeta);
      }
    }
  }, [title, description]);
};
