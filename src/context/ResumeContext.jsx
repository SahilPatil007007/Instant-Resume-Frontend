import { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([
    {
      id: '1',
      title: 'Software Engineer Resume',
      lastUpdated: '2025-01-08',
      data: {
        fullName: 'John Doe',
        summary: 'Experienced software engineer with 5+ years in full-stack development.',
        workExperience: [
          {
            id: '1',
            company: 'Tech Corp',
            position: 'Senior Developer',
            startDate: '2020-01',
            endDate: 'Present',
            description: 'Led development of web applications using React and Node.js.',
          }
        ],
        education: [
          {
            id: '1',
            school: 'University of Technology',
            degree: 'BS Computer Science',
            startDate: '2016-09',
            endDate: '2020-05',
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        photo: null,
      },
    },
  ]);

  const [currentResume, setCurrentResume] = useState(null);

  const createResume = (resumeData) => {
    const newResume = {
      id: Date.now().toString(),
      title: resumeData.title || 'Untitled Resume',
      lastUpdated: new Date().toISOString().split('T')[0],
      data: resumeData,
    };
    setResumes(prev => [...prev, newResume]);
    return newResume;
  };

  const updateResume = (id, updates) => {
    setResumes(prev => prev.map(resume => 
      resume.id === id 
        ? { ...resume, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
        : resume
    ));
  };

  const deleteResume = (id) => {
    setResumes(prev => prev.filter(resume => resume.id !== id));
  };

  const getResume = (id) => {
    return resumes.find(resume => resume.id === id);
  };

  const value = {
    resumes,
    currentResume,
    setCurrentResume,
    createResume,
    updateResume,
    deleteResume,
    getResume,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};