import React from 'react';
import LuxuryDownloadButton from './LuxuryDownloadButton';

const CVSection: React.FC = () => {
  // The URL is relative to the public folder
  const cvUrl = '/assets/cv/KirthikR.pdf';
  
  return (
    <section className="py-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">My Curriculum Vitae</h2>
      <p className="text-gray-300 mb-8 text-center max-w-2xl">
        Download my CV to learn more about my experience, skills, and qualifications.
      </p>
      
      <LuxuryDownloadButton 
        cvUrl={cvUrl}
        fileName="KirthikR.pdf" 
        className="w-64"
      />
    </section>
  );
};

export default CVSection;
