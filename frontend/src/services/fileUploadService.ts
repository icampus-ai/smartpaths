export const uploadFileToBackend = async (fileUrl: string, fileType: string) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl, fileType }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };