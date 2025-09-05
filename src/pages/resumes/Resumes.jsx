import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

const Resumes = () => {
  const { resumes, deleteResume } = useResume();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastUpdated');

  const filteredResumes = resumes
    .filter(resume => 
      resume.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'lastUpdated') {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      return a.title.localeCompare(b.title);
    });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteResume(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Your Resumes
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage and edit your professional resumes
            </p>
          </div>
          <Link
            to="/create-resume"
            className="btn-primary mt-4 md:mt-0 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Resume</span>
          </Link>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none"
            >
              <option value="lastUpdated">Last Updated</option>
              <option value="title">Title</option>
            </select>
          </div>
        </motion.div>

        {/* Resumes Grid */}
        {filteredResumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card card-hover group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <FileText className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {resume.title}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>Updated {formatDate(resume.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume Preview Info */}
                <div className="mb-6 space-y-2">
                  {resume.data.fullName && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Name:</span> {resume.data.fullName}
                    </p>
                  )}
                  {resume.data.workExperience?.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Experience:</span> {resume.data.workExperience.length} positions
                    </p>
                  )}
                  {resume.data.skills?.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Skills:</span> {resume.data.skills.slice(0, 3).join(', ')}
                      {resume.data.skills.length > 3 && ` +${resume.data.skills.length - 3} more`}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <Link
                    to={`/edit-resume/${resume.id}`}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(resume.id, resume.title)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No resumes found' : 'No resumes yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first resume to get started'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/create-resume"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Resume</span>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Resumes;