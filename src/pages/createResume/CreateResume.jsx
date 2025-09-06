import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Upload, X, Eye, Github, Linkedin, Globe, Loader2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import ResumePreview from '../../components/ResumePreview'
import { useParams, useNavigate } from 'react-router-dom';
import { fetchResumeById } from '../../api/resume';
import { improveWithAI } from '../../api/ai';
import Cropper from 'react-easy-crop';
import { pdf } from '@react-pdf/renderer';
import PDFResume from '../../components/PDFResume';

const CreateResume = () => {
  const { createResume, updateResume } = useResume();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [currentTemplate, setCurrentTemplate] = useState('classic');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState({
    summary: false,
    experience: {},
    project: {}
  });
  const previewRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: 'My Resume',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      portfolio: '',
      photoUrl: null,
      showPhoto: false
    },
    summary: '',
    jobDescription: '', // Add this line
    experience: [
      {
        id: Date.now(),
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ['']
      }
    ],
    education: [
      {
        id: Date.now() + 1,
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        current: false,
        score: ''
      }
    ],
    projects: [
      {
        id: Date.now() + 2,
        name: '',
        description: [''],
        technologies: [],
        link: ''
      }
    ],
    skills: [],
    certifications: [
      {
        id: Date.now() + 3,
        title: '',
        issuer: '',
        date: ''
      }
    ],
    achievements: [],
    extraCurricular: []
  });

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const toMonthString = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  };

  const fromMonthString = (value) => {
    if (!value) return null;
    // Append day for a valid ISO date the backend can parse
    return `${value}-01`;
  };

  useEffect(() => {
    if (!isEdit) return;
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const full = await fetchResumeById(id);
        if (!isMounted) return;
        setFormData({
          title: full.title || 'My Resume',
          personalInfo: {
            name: full.personalInfo?.name || '',
            email: full.personalInfo?.email || '',
            phone: full.personalInfo?.phone || '',
            address: full.personalInfo?.address || '',
            linkedin: full.personalInfo?.linkedin || '',
            github: full.personalInfo?.github || '',
            portfolio: full.personalInfo?.portfolio || '',
            photoUrl: full.personalInfo?.photoUrl || null,
            showPhoto: Boolean(full.personalInfo?.showPhoto),
          },
          summary: full.summary || '',
          jobDescription: full.jobDescription || '', // Add this line
          experience: (full.experience || []).map((exp) => ({
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
            title: exp.title || '',
            company: exp.company || '',
            startDate: toMonthString(exp.startDate),
            endDate: toMonthString(exp.endDate),
            current: !exp.endDate,
            description: Array.isArray(exp.description) && exp.description.length > 0 ? exp.description : [''],
          })),
          education: (full.education || []).map((edu) => ({
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
            degree: edu.degree || '',
            institution: edu.institution || '',
            startDate: toMonthString(edu.startDate),
            endDate: toMonthString(edu.endDate),
            current: !edu.endDate,
            score: edu.score || '',
          })),
          projects: (full.projects || []).map((p) => ({
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
            name: p.name || '',
            description: Array.isArray(p.description) ? p.description : (p.description ? [p.description] : ['']),
            technologies: Array.isArray(p.technologies) ? p.technologies : [],
            link: p.link || '',
          })),
          skills: Array.isArray(full.skills) ? full.skills : [],
          certifications: (full.certifications || []).map((c) => ({
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
            title: c.title || '',
            issuer: c.issuer || '',
            date: toMonthString(c.date),
          })),
          achievements: Array.isArray(full.achievements) ? full.achievements : [],
          extraCurricular: Array.isArray(full.extraCurricular) ? full.extraCurricular : [],
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [isEdit, id]);

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentAchievement, setCurrentAchievement] = useState('');
  const [currentExtraCurricular, setCurrentExtraCurricular] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const getCroppedImg = async (imageSrc, cropPixels) => {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.92);
    });
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const confirmCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setCropModalOpen(false);
      return;
    }
    const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
    handlePersonalInfoChange('photoUrl', croppedDataUrl);
    setCropModalOpen(false);
    setImageSrc(null);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageSrc(ev.target.result);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExperienceChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleExperienceDescriptionChange = (id, index, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? {
          ...exp,
          description: exp.description.map((desc, i) => i === index ? value : desc)
        } : exp
      )
    }));
  };

  const addExperienceDescription = (id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? {
          ...exp,
          description: [...exp.description, '']
        } : exp
      )
    }));
  };

  const removeExperienceDescription = (id, index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? {
          ...exp,
          description: exp.description.filter((_, i) => i !== index)
        } : exp
      )
    }));
  };

  const handleEducationChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleProjectChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const handleProjectTechnologyChange = (id, technologies) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, technologies } : project
      )
    }));
  };

  
  const handleProjectDescriptionChange = (id, index, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? {
          ...project,
          description: project.description.map((desc, i) => i === index ? value : desc)
        } : project
      )
    }));
  };

  const addProjectDescription = (id) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? {
          ...project,
          description: [...project.description, '']
        } : project
      )
    }));
  };

  const removeProjectDescription = (id, index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? {
          ...project,
          description: project.description.filter((_, i) => i !== index)
        } : project
      )
    }));
  };

  const improveProjectWithAI = async (projectId) => {
    const project = formData.projects.find(p => p.id === projectId);
    if (!project) return;
    
    setAiLoading(prev => ({
      ...prev,
      project: { ...prev.project, [projectId]: true }
    }));
    
    try {
      const context = {
        name: project.name,
        description: project.description.join('; '),
        skills: formData.skills
      };
      const improvedText = await improveWithAI('project', context);
      const bulletPoints = improvedText.split('\n').filter(line => line.trim()).map(line => line.replace(/^[-•*]\s*/, '').trim());
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.map(p =>
          p.id === projectId ? { ...p, description: bulletPoints } : p
        )
      }));
    } catch (error) {
      console.error('Failed to improve project with AI:', error);
    } finally {
      setAiLoading(prev => ({
        ...prev,
        project: { ...prev.project, [projectId]: false }
      }));
    }
  };

  const improveExperienceWithAI = async (experienceId) => {
    const experience = formData.experience.find(exp => exp.id === experienceId);
    if (!experience) return;
    
    setAiLoading(prev => ({
      ...prev,
      experience: { ...prev.experience, [experienceId]: true }
    }));
    
    try {
      const context = {
        title: experience.title,
        company: experience.company,
        description: experience.description.join('; '),
        skills: formData.skills
      };
      const improvedText = await improveWithAI('experience', context);
      const bulletPoints = improvedText.split('\n').filter(line => line.trim()).map(line => line.replace(/^[-•*]\s*/, '').trim());
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.map(exp =>
          exp.id === experienceId ? { ...exp, description: bulletPoints } : exp
        )
      }));
    } catch (error) {
      console.error('Failed to improve experience with AI:', error);
    } finally {
      setAiLoading(prev => ({
        ...prev,
        experience: { ...prev.experience, [experienceId]: false }
      }));
    }
  };

  const improveSummaryWithAI = async () => {
    setAiLoading(prev => ({ ...prev, summary: true }));
    
    try {
      const context = {
        summary: formData.summary,
        skills: formData.skills,
        jobDescription: formData.jobDescription, // Add this line
        experience: formData.experience.map(exp => ({
          title: exp.title,
          company: exp.company
        })),
        projects: formData.projects.map(p => ({
          name: p.name,
          description: p.description
        }))
      };
  
      const improvedText = await improveWithAI('summary', context);
      handleInputChange('summary', improvedText);
    } catch (error) {
      console.error('Failed to improve summary with AI:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, summary: false }));
    }
  };
  

  const handleCertificationChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  // Add functions for all sections
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ['']
      }]
    }));
  };

  const removeExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        current: false,
        score: ''
      }]
    }));
  };

  const removeEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now(),
        name: '',
        description: [''],
        technologies: [],
        link: ''
      }]
    }));
  };

  const removeProject = (id) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        id: Date.now(),
        title: '',
        issuer: '',
        date: ''
      }]
    }));
  };

  const removeCertification = (id) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addAchievement = () => {
    if (currentAchievement.trim() && !formData.achievements.includes(currentAchievement.trim())) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, currentAchievement.trim()]
      }));
      setCurrentAchievement('');
    }
  };

  const removeAchievement = (achievementToRemove) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement !== achievementToRemove)
    }));
  };

  const addExtraCurricular = () => {
    if (currentExtraCurricular.trim() && !formData.extraCurricular.includes(currentExtraCurricular.trim())) {
      setFormData(prev => ({
        ...prev,
        extraCurricular: [...prev.extraCurricular, currentExtraCurricular.trim()]
      }));
      setCurrentExtraCurricular('');
    }
  };

  const removeExtraCurricular = (extraCurricularToRemove) => {
    setFormData(prev => ({
      ...prev,
      extraCurricular: prev.extraCurricular.filter(item => item !== extraCurricularToRemove)
    }));
  };

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      personalInfo: formData.personalInfo,
      summary: formData.summary,
      jobDescription: formData.jobDescription, // Add this line
      experience: formData.experience.map((exp) => ({
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate ? fromMonthString(exp.startDate) : null,
        endDate: exp.current ? null : (exp.endDate ? fromMonthString(exp.endDate) : null),
        description: Array.isArray(exp.description) ? exp.description.filter(Boolean) : [],
      })),
      education: formData.education.map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        startDate: edu.startDate ? fromMonthString(edu.startDate) : null,
        endDate: edu.current ? null : (edu.endDate ? fromMonthString(edu.endDate) : null),
        score: edu.score,
      })),
      projects: formData.projects.map((p) => ({
        name: p.name,
        description: Array.isArray(p.description) ? p.description.filter(Boolean) : [],
        technologies: Array.isArray(p.technologies) ? p.technologies : [],
        link: p.link,
      })),
      skills: Array.isArray(formData.skills) ? formData.skills : [],
      certifications: formData.certifications.map((c) => ({
        title: c.title,
        issuer: c.issuer,
        date: c.date ? fromMonthString(c.date) : null,
      })),
      achievements: Array.isArray(formData.achievements) ? formData.achievements : [],
      extraCurricular: Array.isArray(formData.extraCurricular) ? formData.extraCurricular : [],
    };

    if (isEdit) {
      await updateResume(id, payload);
    } else {
      await createResume(payload);
    }
    navigate('/your-resumes');
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      // Generate PDF using react-pdf
      const blob = await pdf(<PDFResume data={formData} template={currentTemplate} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = formData.title?.trim() ? `${formData.title}.pdf` : "resume.pdf";
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {isEdit ? 'Edit Resume' : 'Create Resume'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Build your professional resume with our AI-powered tools
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden btn-outline flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={loading}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              type="button"
              title="Download PDF"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleSave}
              className="btn-primary"
            >
              {isEdit ? 'Save Changes' : 'Save Resume'}
            </button>
          </div>
        </motion.div>

        {/* Template Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Choose Template
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentTemplate('classic')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentTemplate === 'classic'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Classic Template
            </button>
            <button
              onClick={() => setCurrentTemplate('modern')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentTemplate === 'modern'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Modern Template
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Column */}
          <div
            className={`space-y-8 ${showPreview ? 'hidden lg:block' : ''} overflow-y-auto h-[calc(100vh-8rem)] pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-gray-100 dark:scrollbar-track-gray-800`}
          >
            {/* Job Description */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Job Description
                  </h3>
                </div>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="Enter the job description for better AI optimization..."
                />
              </motion.div>
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resume Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="input-field"
                    placeholder="e.g. Software Engineer Resume"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                      className="input-field"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Linkedin className="h-4 w-4 inline mr-1" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.personalInfo.linkedin}
                      onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                      className="input-field"
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Github className="h-4 w-4 inline mr-1" />
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.personalInfo.github}
                      onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                      className="input-field"
                      placeholder="github.com/johndoe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Globe className="h-4 w-4 inline mr-1" />
                      Portfolio
                    </label>
                    <input
                      type="url"
                      value={formData.personalInfo.portfolio}
                      onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                      className="input-field"
                      placeholder="johndoe.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Photo (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Photo</span>
                    </label>
                    {formData.personalInfo.photoUrl && (
                      <div className="flex items-center space-x-2">
                        <img
                          src={formData.personalInfo.photoUrl}
                          alt="Profile"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <button
                          onClick={() => handlePersonalInfoChange('photoUrl', null)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.personalInfo.showPhoto}
                        onChange={(e) => handlePersonalInfoChange('showPhoto', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Show photo on resume</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Professional Summary
                </h3>
                <button
                  type="button"
                  onClick={improveSummaryWithAI}
                  disabled={aiLoading.summary}
                  className="text-green-600 hover:text-green-700 text-sm px-3 py-1 border border-green-600 rounded hover:bg-green-50 dark:hover:bg-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {aiLoading.summary && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>Improve with AI</span>
                </button>
              </div>
              <textarea
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                className="input-field"
                rows={4}
                placeholder="A brief summary of your professional background and key achievements..."
              />
            </motion.div>


            {/* Work Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Work Experience
                </h3>
                <button
                  onClick={addExperience}
                  className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Experience</span>
                </button>
              </div>
              <div className="space-y-6">
                {formData.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Experience {index + 1}
                      </span>
                      {formData.experience.length > 1 && (
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                            className="input-field"
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                            className="input-field"
                            placeholder="Job Title"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Date
                          </label>
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Date
                          </label>
                          <div className="space-y-2">
                            <input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                              className="input-field"
                              disabled={exp.current}
                            />
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => handleExperienceChange(exp.id, 'current', e.target.checked)}
                                className="rounded border-gray-300 dark:border-gray-600"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Current position</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Job Description (Bullet Points)
                          </label>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => addExperienceDescription(exp.id)}
                              className="text-primary-600 hover:text-primary-700 text-sm"
                            >
                              Add Point
                            </button>
                            <button
                              type="button"
                              onClick={() => improveExperienceWithAI(exp.id)}
                              disabled={aiLoading.experience[exp.id]}
                              className="text-green-600 hover:text-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                            >
                              {aiLoading.experience[exp.id] && <Loader2 className="h-3 w-3 animate-spin" />}
                              <span>Improve with AI</span>
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {exp.description.map((desc, descIndex) => (
                            <div key={descIndex} className="flex items-center space-x-2">
                              <span className="text-gray-400">•</span>
                              <input
                                type="text"
                                value={desc}
                                onChange={(e) => handleExperienceDescriptionChange(exp.id, descIndex, e.target.value)}
                                className="input-field flex-1"
                                placeholder="Describe your responsibilities and achievements..."
                              />
                              {exp.description.length > 1 && (
                                <button
                                  onClick={() => removeExperienceDescription(exp.id, descIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Education
                </h3>
                <button
                  onClick={addEducation}
                  className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Education</span>
                </button>
              </div>
              <div className="space-y-6">
                {formData.education.map((edu, index) => (
                  <div key={edu.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Education {index + 1}
                      </span>
                      {formData.education.length > 1 && (
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                            className="input-field"
                            placeholder="University Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                            className="input-field"
                            placeholder="Bachelor of Science"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Date
                          </label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Date
                          </label>
                          <div className="space-y-2">
                            <input
                              type="month"
                              value={edu.endDate}
                              onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                              className="input-field"
                              disabled={edu.current}
                            />
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={edu.current}
                                onChange={(e) => handleEducationChange(edu.id, 'current', e.target.checked)}
                                className="rounded border-gray-300 dark:border-gray-600"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Currently studying</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Score/GPA
                          </label>
                          <input
                            type="text"
                            value={edu.score}
                            onChange={(e) => handleEducationChange(edu.id, 'score', e.target.value)}
                            className="input-field"
                            placeholder="3.8/4.0 or 85%"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Projects
                </h3>
                <button
                  onClick={addProject}
                  className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Project</span>
                </button>
              </div>
              <div className="space-y-6">
                {formData.projects.map((project, index) => (
                  <div key={project.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Project {index + 1}
                      </span>
                      {formData.projects.length > 1 && (
                        <button
                          onClick={() => removeProject(project.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project Name
                          </label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => handleProjectChange(project.id, 'name', e.target.value)}
                            className="input-field"
                            placeholder="My Awesome Project"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project Link
                          </label>
                          <input
                            type="url"
                            value={project.link}
                            onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                            className="input-field"
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Project Description (Bullet Points)
                          </label>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => addProjectDescription(project.id)}
                              className="text-primary-600 hover:text-primary-700 text-sm"
                            >
                              Add Point
                            </button>
                            <button
                              type="button"
                              onClick={() => improveProjectWithAI(project.id)}
                              disabled={aiLoading.project[project.id]}
                              className="text-green-600 hover:text-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                            >
                              {aiLoading.project[project.id] && <Loader2 className="h-3 w-3 animate-spin" />}
                              <span>Improve with AI</span>
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {project.description.map((desc, descIndex) => (
                            <div key={descIndex} className="flex items-center space-x-2">
                              <span className="text-gray-400">•</span>
                              <input
                                type="text"
                                value={desc}
                                onChange={(e) => handleProjectDescriptionChange(project.id, descIndex, e.target.value)}
                                className="input-field flex-1"
                                placeholder="Describe your project achievements..."
                              />
                              {project.description.length > 1 && (
                                <button
                                  onClick={() => removeProjectDescription(project.id, descIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Technologies
                        </label>
                        <input
                          type="text"
                          value={project.technologies.join(', ')}
                          onChange={(e) => handleProjectTechnologyChange(project.id, e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech))}
                          className="input-field"
                          placeholder="React, Node.js, MongoDB, etc."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Skills
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="input-field flex-1"
                    placeholder="Add a skill"
                  />
                  <button
                    onClick={addSkill}
                    className="btn-primary"
                  >
                    Add
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-primary-500 hover:text-primary-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Certifications
                </h3>
                <button
                  onClick={addCertification}
                  className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Certification</span>
                </button>
              </div>
              <div className="space-y-6">
                {formData.certifications.map((cert, index) => (
                  <div key={cert.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Certification {index + 1}
                      </span>
                      {formData.certifications.length > 1 && (
                        <button
                          onClick={() => removeCertification(cert.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Certification Title
                          </label>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => handleCertificationChange(cert.id, 'title', e.target.value)}
                            className="input-field"
                            placeholder="AWS Certified Developer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Issuer
                          </label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => handleCertificationChange(cert.id, 'issuer', e.target.value)}
                            className="input-field"
                            placeholder="Amazon Web Services"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date Obtained
                        </label>
                        <input
                          type="month"
                          value={cert.date}
                          onChange={(e) => handleCertificationChange(cert.id, 'date', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Achievements
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentAchievement}
                    onChange={(e) => setCurrentAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                    className="input-field flex-1"
                    placeholder="Add an achievement"
                  />
                  <button
                    onClick={addAchievement}
                    className="btn-primary"
                  >
                    Add
                  </button>
                </div>
                {formData.achievements.length > 0 && (
                  <div className="space-y-2">
                    {formData.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <span className="flex-1 text-sm">{achievement}</span>
                        <button
                          onClick={() => removeAchievement(achievement)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Extra Curricular */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Extra Curricular Activities
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentExtraCurricular}
                    onChange={(e) => setCurrentExtraCurricular(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addExtraCurricular()}
                    className="input-field flex-1"
                    placeholder="Add an extra curricular activity"
                  />
                  <button
                    onClick={addExtraCurricular}
                    className="btn-primary"
                  >
                    Add
                  </button>
                </div>
                {formData.extraCurricular.length > 0 && (
                  <div className="space-y-2">
                    {formData.extraCurricular.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <span className="flex-1 text-sm">{activity}</span>
                        <button
                          onClick={() => removeExtraCurricular(activity)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Preview Column */}
          <div
            className={`${showPreview ? 'block' : 'hidden lg:block'} overflow-y-auto h-[calc(100vh-8rem)] pl-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-gray-100 dark:scrollbar-track-gray-800`}
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h3>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div ref={previewRef}>
                 <ResumePreview 
                    data={formData} 
                    template={currentTemplate}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {cropModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Crop Photo
              </h3>
              <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-900 rounded">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCrop}
                  className="btn-primary"
                >
                  Confirm Crop
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateResume;