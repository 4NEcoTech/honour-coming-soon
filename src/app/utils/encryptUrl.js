
export async function encryptUrl(url) {
    try {
      const response = await fetch('/api/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to encrypt URL');
      }
  
      const data = await response.json();
      return data.encryptedUrl;
    } catch (error) {
      console.error('Error encrypting URL:', error);
      return null;
    }
  }
  