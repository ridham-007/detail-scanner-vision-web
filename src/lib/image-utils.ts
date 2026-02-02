/**
 * Converts an image File to a WebP format Blob.
 * 
 * @param file The original image file
 * @param quality The quality of the output WebP (0 to 1)
 * @returns A Promise that resolves to a WebP Blob
 */
export const convertToWebP = (file: File, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to convert image to WebP'));
                        }
                    },
                    'image/webp',
                    quality
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = event.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};
