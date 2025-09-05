import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Upload, X, Eye, Github, Linkedin, Globe } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import ResumePreview from '../../components/ResumePreview'

const CreateResume = () => {
  const { createResume } = useResume();
  const [currentTemplate, setCurrentTemplate] = useState('classic');
  const [showPreview, setShowPreview] = useState(false);
  
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
        description: '',
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
        description: '',
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handlePersonalInfoChange('photoUrl', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const resume = createResume(formData);
    console.log('Resume created:', resume);
    // You could redirect or show a success message here
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
              Create Resume
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
              onClick={handleSave}
              className="btn-primary"
            >
              Save Resume
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
          <div className={`space-y-8 ${showPreview ? 'hidden lg:block' : ''}`}>
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Professional Summary
              </h3>
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
                          <button
                            type="button"
                            onClick={() => addExperienceDescription(exp.id)}
                            className="text-primary-600 hover:text-primary-700 text-sm"
                          >
                            Add Point
                          </button>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={project.description}
                          onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                          className="input-field"
                          rows={3}
                          placeholder="Describe what this project does and your role..."
                        />
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
          <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-20"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Live Preview
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <ResumePreview 
                  data={formData} 
                  template={currentTemplate}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateResume;