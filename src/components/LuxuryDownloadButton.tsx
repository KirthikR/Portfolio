import React from 'react';

interface LuxuryDownloadButtonProps {
  cvUrl: string;
  fileName: string;
  className?: string;
}

const LuxuryDownloadButton: React.FC<LuxuryDownloadButtonProps> = ({
  cvUrl,
  fileName,
  className = ''
}) => {
  const handleDownload = () => {
    // Try to fetch the CV first
    fetch(cvUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('CV not found');
        }
        return response.blob();
      })
      .then(blob => {
        // Create download link and trigger it
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading CV:', error);
        // Show error message to user
        alert('Could not download CV. Please try again later.');
      });
  };

  return (
    <button
      onClick={handleDownload}
      className={`bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 
                  text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 
                  transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center ${className}`}
    >
      <span className="mr-2">Download CV</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    </button>
  );
};

export default LuxuryDownloadButton;
