import React, { useEffect } from 'react';

export function MaybeShowApiKeyBanner({ key, action = `enter it at the top of <code>main.js</code>` }) {
  useEffect(() => {
    if (key === 'TODO') {
      const banner = document.createElement('div');
      banner.className = 'api-key-banner';
      banner.innerHTML = `
        To get started with the Gemini API,
        <a href="https://g.co/ai/idxGetGeminiKey" target="_blank" rel="noopener noreferrer">
          get an API key
        </a> (Ctrl+Click) and ${action}`;
      document.body.prepend(banner);

      return () => {
        const bannerElement = document.querySelector('.api-key-banner');
        if (bannerElement) {
          bannerElement.remove();
        }
      };
    }
  }, [key, action]);

  return null;
}