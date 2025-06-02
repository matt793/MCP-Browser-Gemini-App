import React from 'react';
import { AnalysisResult } from '../types'; // Assuming types.ts is in the root

interface ResultsDisplayProps {
  results: AnalysisResult[]; // This will be an array of structured results
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return <p className="text-gray-500 p-4">Loading analysis results...</p>;
  }

  if (!results || results.length === 0) {
    return <p className="text-gray-500 p-4">No analysis results to display yet. Run an analysis to see results here.</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow-md mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysis Results</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {results.map((result) => (
          <div key={result.id} className="p-3 bg-gray-50 rounded border border-gray-200">
            <h4 className="font-medium text-gray-700">{result.type || 'Result'}</h4>
            {result.summary && <p className="text-sm text-gray-600 mb-1">{result.summary}</p>}
            <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded">{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        ))}
      </div>
       <p className="text-xs text-gray-400 mt-2">
        Note: This is a placeholder. Full results display will be implemented in Phase 2.
      </p>
    </div>
  );
};

export default ResultsDisplay;
