export function generateApiKey(): string {
    const apiKeyLength = 32;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';
  
    for (let i = 0; i < apiKeyLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      apiKey += characters.charAt(randomIndex);
    }
  
    return apiKey;
}