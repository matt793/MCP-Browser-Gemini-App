import React, { useRef, useEffect } from 'react';

interface BrowserFrameProps {
  currentUrl: string;
  onPageLoad?: () => void; // Callback when iframe content finishes loading
  onPageError?: (error: any) => void; // Callback for iframe load errors
  setIsLoading: (isLoading: boolean) => void;
}

const BrowserFrame: React.FC<BrowserFrameProps> = ({
  currentUrl,
  onPageLoad,
  onPageError,
  setIsLoading,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      console.log('iframe loaded:', currentUrl);
      setIsLoading(false);
      if (onPageLoad) {
        onPageLoad();
      }
      // Attempt to access iframe contentWindow or contentDocument can cause cross-origin errors
      // if the iframe's src is a different origin. For now, just signal load completion.
    };

    const handleError = (error: any) => {
      console.error('iframe error:', error, 'URL:', currentUrl);
      setIsLoading(false);
      if (onPageError) {
        onPageError(error);
      }
    };

    // Set isLoading to true when the src changes and is not empty
    if (currentUrl) {
      setIsLoading(true);
    } else {
      // If currentUrl is empty, it's not loading anything.
      setIsLoading(false);
    }

    // Set src attribute directly to trigger load
    // This also helps in re-triggering load if currentUrl is the same
    // but a refresh is desired (though refresh is usually handled by setting src again).
    if (iframeRef.current) {
        if (currentUrl) {
            iframeRef.current.src = currentUrl;
        } else {
            // Load a blank page if no URL is provided to clear previous content
            iframeRef.current.src = 'about:blank';
        }
    }

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [currentUrl, onPageLoad, onPageError, setIsLoading]);

  return (
    <div className="w-full h-full border border-gray-300 shadow-inner bg-white">
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Browser Content"
        // The src is now set via useEffect to better control loading state
      />
    </div>
  );
};

export default BrowserFrame;
