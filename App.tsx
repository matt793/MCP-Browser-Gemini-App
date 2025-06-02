import React, { useState, useCallback, useEffect } from 'react';
import BrowserControls from './components/BrowserControls';
import BrowserFrame from './components/BrowserFrame';
import Footer from './components/Footer'; // Import Footer
import LoadingSpinner from './components/LoadingSpinner'; // Import LoadingSpinner
// import ContentAnalyzer from './components/ContentAnalyzer'; // Placeholder for later
import ContentAnalyzer from './components/ContentAnalyzer'; // Import ContentAnalyzer
import { AppState } from './types';

const DEFAULT_URL = 'https://www.google.com/search?q=AI+Browser+Automation';

function App() {
  const [currentUrl, setCurrentUrl] = useState<string>(DEFAULT_URL);
  const [history, setHistory] = useState<string[]>([DEFAULT_URL]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true for initial load

  const navigateToUrl = useCallback((url: string) => {
    if (!url || url.trim() === '' || url === 'about:blank') {
      if (currentUrl !== 'about:blank') {
        setCurrentUrl('about:blank');
        setIsLoading(false);
      }
      return;
    }
    console.log('Navigating to:', url);
    setIsLoading(true);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(url);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentUrl(url);
  }, [history, historyIndex, currentUrl]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      setIsLoading(true);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
    }
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsLoading(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
    }
  }, [history, historyIndex]);

  const refreshPage = useCallback(() => {
    if (currentUrl && currentUrl !== 'about:blank') {
      setIsLoading(true);
      // Appending a unique query string parameter is a common way to bypass cache for a refresh
      const cacheBuster = `_cb=${Date.now()}`;
      const refreshedUrl = currentUrl.includes('?') ? `${currentUrl}&${cacheBuster}` : `${currentUrl}?${cacheBuster}`;
      // Update currentUrl to trigger useEffect in BrowserFrame
      setCurrentUrl(refreshedUrl);
    } else if (currentUrl === 'about:blank') {
        // If the page is blank, "refresh" doesn't mean much, ensure loading is false.
        setIsLoading(false);
    }
  }, [currentUrl]);

  const goHome = useCallback(() => {
    navigateToUrl(DEFAULT_URL);
  }, [navigateToUrl]);

  useEffect(() => {
    if (currentUrl === 'about:blank' && isLoading) {
      setIsLoading(false);
    }
  }, [currentUrl, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header Section: Browser Controls */}
      <header className="shrink-0">
        <BrowserControls
          onNavigate={navigateToUrl}
          onGoBack={goBack}
          onGoForward={goForward}
          onRefresh={refreshPage}
          onHome={goHome}
          initialUrl={currentUrl}
        />
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex overflow-hidden">
        {/* Browser Frame (70%) */}
        <section className="w-full md:w-2/3 h-full relative bg-white shadow-lg"> {/* Adjusted width for typical main content */}
          {isLoading && <LoadingSpinner />}
          <BrowserFrame
            currentUrl={currentUrl}
            setIsLoading={setIsLoading}
            onPageLoad={() => console.log('App: Page loaded')}
            onPageError={(err) => {
              console.error('App: Page error', err);
              // Optionally navigate to an error page or show a message
              // setCurrentUrl('about:blank'); // Example: clear iframe on error
            }}
          />
        </section>

        {/* Analysis Panel (30%) - Placeholder */}
        {/* Analysis Panel (adjust width, e.g., md:w-1/3) */}
        <aside className="hidden md:block md:w-1/3 h-full bg-gray-100 p-1 border-l border-gray-300 overflow-y-auto">
          {/* Replace placeholder content with ContentAnalyzer */}
          <ContentAnalyzer
            // currentContent={pageHtmlContent} // This would be page content from iframe
            // onAnalysisComplete={(newResults) => setAnalysisResults(prev => [...prev, newResults])}
          />
          {/* ResultsDisplay could also go here or be part of ContentAnalyzer initially */}
          {/* <ResultsDisplay results={analysisResults} isLoading={isLoadingAnalysis} /> */}
        </aside>
      </main>

      {/* Footer Section */}
      <footer className="shrink-0">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
