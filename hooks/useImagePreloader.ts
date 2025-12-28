import { useEffect, useState } from 'react';
import { PROJECTS, HOBBIES } from '../constants';

export const useImagePreloader = () => {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    const imageUrls: string[] = [];

    // Extract images from PROJECTS
    PROJECTS.forEach((project) => {
      if (project.imageUrl) imageUrls.push(project.imageUrl);
      if (project.gallery) {
        project.gallery.forEach((item) => {
          if (item.url) imageUrls.push(item.url);
        });
      }
    });

    // Extract images from HOBBIES
    HOBBIES.forEach((hobby) => {
      if (hobby.imageUrl) imageUrls.push(hobby.imageUrl);
      if (hobby.gallery) {
        hobby.gallery.forEach((item) => {
          if (item.url) imageUrls.push(item.url);
        });
      }
    });

    // Deduplicate
    const uniqueUrls = [...new Set(imageUrls)];

    let loadedCount = 0;
    const totalImages = uniqueUrls.length;

    if (totalImages === 0) {
      setImagesPreloaded(true);
      return;
    }

    const preloadImage = (url: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = resolve; // Resolve even on error to continue
      });
    };

    Promise.all(uniqueUrls.map(preloadImage))
      .then(() => {
        setImagesPreloaded(true);
        console.log(`Preloaded ${totalImages} images.`);
      })
      .catch((err) => {
        console.error("Error preloading images", err);
        setImagesPreloaded(true);
      });

  }, []);

  return { imagesPreloaded };
};
