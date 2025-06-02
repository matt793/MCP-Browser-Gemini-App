import React, { useState } from 'react';
// import { analyzePageContent } from '../services/geminiService'; // For future use

interface ContentAnalyzerProps {
  // currentContent: string; // HTML content of the current page - to be passed from App
  // onAnalysisComplete: (results: any) => void; // Callback to send results to App/ResultsDisplay
}

const ContentAnalyzer: React.FC<ContentAnalyzerProps> = (/*{ currentContent, onAnalysisComplete }*/) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    // console.log("Analyzing content (placeholder)... Current prompt:", prompt);
    // In future, call actual service:
    // try {
    //   const result = await analyzePageContent(currentContent, prompt || "Analyze this webpage and extract key information");
    //   setAnalysisResult(result);
    //   if(onAnalysisComplete) onAnalysisComplete(result);
    // } catch (error) {
    //   setAnalysisResult("Error during analysis.");
    //   if(onAnalysisComplete) onAnalysisComplete({error: "Error during analysis."});
    // }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockResult = `Analysis for prompt "${prompt || 'default analysis'}": Key insights found. Summary: This is a placeholder summary of the analyzed content.`;
    setAnalysisResult(mockResult);
    // if(onAnalysisComplete) onAnalysisComplete(mockResult); // For future integration with ResultsDisplay

    setIsLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Content Analyzer</h3>

      <div className="mb-4">
        <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-1">
          Custom Analysis Prompt (Optional):
        </label>
        <textarea
          id="customPrompt"
          rows={3}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Extract all email addresses"
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 w-full mb-4"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Page Content'}
      </button>

      {analysisResult && (
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200 overflow-y-auto flex-grow">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Analysis Result:</h4>
          <pre className="whitespace-pre-wrap text-sm text-gray-600">{analysisResult}</pre>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-auto pt-2">
        Note: This is a placeholder. Full AI analysis will be implemented in Phase 2.
      </p>
    </div>
  );
};

export default ContentAnalyzer;
