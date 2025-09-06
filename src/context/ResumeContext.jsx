import { createContext, useContext, useEffect, useState } from 'react';
import { 
  fetchResumes,
  fetchResumeById,
  createResumeApi,
  updateResumeApi,
  deleteResumeApi
} from '../api/resume';
import { useAuth } from './AuthContext';

const ResumeContext = createContext();

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider = ({ children }) => {
  const {user} = useAuth();
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchResumes();
        // Map backend items to UI-friendly shape
        const mapped = list.map((r) => ({
          id: r._id,
          title: r.title || 'Untitled Resume',
          lastUpdated: r.updatedAt?.split('T')[0] || '',
          data: {},
        }));
        if (isMounted) setResumes(mapped);
      } catch (e) {
        if (isMounted) setError('Failed to load resumes');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [user]);

  const createResume = async (resumeData) => {
    const created = await createResumeApi(resumeData);
    const mapped = {
      id: created._id,
      title: created.title || 'Untitled Resume',
      lastUpdated: created.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      data: {},
    };
    setResumes((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateResume = async (id, updates) => {
    const updated = await updateResumeApi(id, updates);
    setResumes((prev) => prev.map((r) => (
      r.id === id
        ? {
            ...r,
            title: updated.title ?? r.title,
            lastUpdated: updated.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          }
        : r
    )));
    if (currentResume?.id === id) {
      setCurrentResume((cr) => cr ? { ...cr, ...updates } : cr);
    }
  };

  const deleteResume = async (id) => {
    await deleteResumeApi(id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
    if (currentResume?.id === id) setCurrentResume(null);
  };

  const getResume = async (id) => {
    const inState = resumes.find((r) => r.id === id);
    if (inState && inState.data && Object.keys(inState.data).length > 0) return inState;
    const full = await fetchResumeById(id);
    const mapped = {
      id: full._id,
      title: full.title || 'Untitled Resume',
      lastUpdated: full.updatedAt?.split('T')[0] || '',
      data: {
        // Adapt fields if your UI consumes them later
        fullName: full.personalInfo?.name || '',
        workExperience: full.experience || [],
        education: full.education || [],
        skills: full.skills || [],
      },
    };
    setResumes((prev) => {
      const exists = prev.some((r) => r.id === id);
      return exists ? prev.map((r) => (r.id === id ? mapped : r)) : [mapped, ...prev];
    });
    return mapped;
  };

  const value = {
    resumes,
    currentResume,
    setCurrentResume,
    createResume,
    updateResume,
    deleteResume,
    getResume,
    loading,
    error,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};