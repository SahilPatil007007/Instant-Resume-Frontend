import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Github, Linkedin, Globe, ExternalLink } from 'lucide-react';

const ResumePreview = ({ data, template = 'classic' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (startDate, endDate, current) => {
    const start = formatDate(startDate);
    const end = current ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  if (template === 'modern') {
    return (
      <ModernTemplate 
        data={data} 
        formatDate={formatDate} 
        formatDateRange={formatDateRange} 
      />
    );
  }

  return (
    <ClassicTemplate 
      data={data} 
      formatDate={formatDate} 
      formatDateRange={formatDateRange} 
    />
  );
};

const ClassicTemplate = ({ data, formatDate, formatDateRange }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="p-8 max-w-2xl mx-auto bg-white text-gray-800 min-h-[11in]"
    style={{ fontFamily: 'serif' }}
  >
    {/* Header */}
    <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
      <div className="flex items-center justify-center space-x-6 mb-4">
        {data.personalInfo?.photoUrl && data.personalInfo?.showPhoto && (
          <img
            src={data.personalInfo.photoUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
          />
        )}
        <div className={data.personalInfo?.photoUrl && data.personalInfo?.showPhoto ? 'text-left' : 'text-center'}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {data.personalInfo?.name || 'Your Name'}
          </h1>
          <div className="flex flex-col space-y-1 text-sm text-gray-600">
            {data.personalInfo?.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo?.address && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {data.personalInfo.address}
              </div>
            )}
            {data.personalInfo?.linkedin && (
              <div className="flex items-center">
                <Linkedin className="w-4 h-4 mr-2" />
                <span className="text-xs">{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo?.github && (
              <div className="flex items-center">
                <Github className="w-4 h-4 mr-2" />
                <span className="text-xs">{data.personalInfo.github}</span>
              </div>
            )}
            {data.personalInfo?.portfolio && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                <span className="text-xs">{data.personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Summary */}
    {data.summary && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
          PROFESSIONAL SUMMARY
        </h2>
        <p className="text-sm leading-relaxed">
          {data.summary}
        </p>
      </div>
    )}

    {/* Work Experience */}
    {data.experience && data.experience.some(exp => exp.company || exp.title) && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
          WORK EXPERIENCE
        </h2>
        <div className="space-y-4">
          {data.experience
            .filter(exp => exp.company || exp.title)
            .map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {exp.title || 'Position'}
                    </h3>
                    <p className="text-sm font-medium text-gray-700">
                      {exp.company || 'Company'}
                    </p>
                  </div>
                  {(exp.startDate || exp.endDate || exp.current) && (
                    <div className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </div>
                  )}
                </div>
                {exp.description && exp.description.filter(desc => desc.trim()).length > 0 && (
                  <ul className="text-sm text-gray-600 leading-relaxed ml-4">
                    {exp.description.filter(desc => desc.trim()).map((desc, index) => (
                      <li key={index} className="list-disc mb-1">{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      </div>
    )}

    {/* Projects */}
    {data.projects && data.projects.some(project => project.name) && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
          PROJECTS
        </h2>
        <div className="space-y-3">
          {data.projects
            .filter(project => project.name)
            .map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {project.name}
                    {project.link && (
                      <ExternalLink className="w-3 h-3 ml-2 text-gray-500" />
                    )}
                  </h3>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">
                    {project.description}
                  </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education && data.education.some(edu => edu.institution || edu.degree) && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
          EDUCATION
        </h2>
        <div className="space-y-3">
          {data.education
            .filter(edu => edu.institution || edu.degree)
            .map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree || 'Degree'}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {edu.institution || 'Institution'}
                    {edu.score && <span className="ml-2 text-gray-600">({edu.score})</span>}
                  </p>
                </div>
                {(edu.startDate || edu.endDate || edu.current) && (
                  <div className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    )}

    {/* Skills */}
    {data.skills && data.skills.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
          SKILLS
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span
              key={index}
              className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Certifications */}
    {data.certifications && data.certifications.some(cert => cert.title) && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
          CERTIFICATIONS
        </h2>
        <div className="space-y-2">
          {data.certifications
            .filter(cert => cert.title)
            .map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {cert.title}
                  </h3>
                  {cert.issuer && (
                    <p className="text-sm text-gray-700">{cert.issuer}</p>
                  )}
                </div>
                {cert.date && (
                  <div className="text-sm text-gray-600">
                    {formatDate(cert.date)}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    )}

    {/* Achievements */}
    {data.achievements && data.achievements.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
          ACHIEVEMENTS
        </h2>
        <ul className="space-y-1">
          {data.achievements.map((achievement, index) => (
            <li key={index} className="text-sm text-gray-600 leading-relaxed list-disc ml-4">
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Extra Curricular */}
    {data.extraCurricular && data.extraCurricular.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
          EXTRA CURRICULAR ACTIVITIES
        </h2>
        <ul className="space-y-1">
          {data.extraCurricular.map((activity, index) => (
            <li key={index} className="text-sm text-gray-600 leading-relaxed list-disc ml-4">
              {activity}
            </li>
          ))}
        </ul>
      </div>
    )}
  </motion.div>
);

const ModernTemplate = ({ data, formatDate, formatDateRange }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="max-w-2xl mx-auto bg-white min-h-[11in]"
    style={{ fontFamily: 'sans-serif' }}
  >
    <div className="grid grid-cols-3 min-h-[11in]">
      {/* Left Sidebar */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6">
        {/* Photo */}
        {data.personalInfo?.photoUrl && data.personalInfo?.showPhoto && (
          <div className="mb-6 text-center">
            <img
              src={data.personalInfo.photoUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white/20 mx-auto"
            />
          </div>
        )}

        {/* Contact Info */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 border-b border-white/20 pb-2">
            Contact
          </h3>
          <div className="space-y-2 text-sm">
            {data.personalInfo?.email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-xs break-all">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo?.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-xs">{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo?.address && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">{data.personalInfo.address}</span>
              </div>
            )}
            {data.personalInfo?.linkedin && (
              <div className="flex items-center space-x-2">
                <Linkedin className="w-4 h-4" />
                <span className="text-xs break-all">{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo?.github && (
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span className="text-xs break-all">{data.personalInfo.github}</span>
              </div>
            )}
            {data.personalInfo?.portfolio && (
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span className="text-xs break-all">{data.personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3 border-b border-white/20 pb-2">
              Skills
            </h3>
            <div className="space-y-1">
              {data.skills.map((skill, index) => (
                <div
                  key={index}
                  className="text-xs bg-white/10 rounded px-2 py-1"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.some(cert => cert.title) && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3 border-b border-white/20 pb-2">
              Certifications
            </h3>
            <div className="space-y-2">
              {data.certifications
                .filter(cert => cert.title)
                .map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <div className="font-semibold">{cert.title}</div>
                    {cert.issuer && <div className="text-white/80">{cert.issuer}</div>}
                    {cert.date && <div className="text-white/60">{formatDate(cert.date)}</div>}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="col-span-2 p-8">
        {/* Name and Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {data.personalInfo?.name || 'Your Name'}
          </h1>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-blue-800 mb-4"></div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 text-blue-800">
              PROFILE
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {data.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.some(exp => exp.company || exp.title) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-blue-800">
              EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience
                .filter(exp => exp.company || exp.title)
                .map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-blue-200">
                    <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-1"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          {exp.title || 'Position'}
                        </h3>
                        <p className="font-semibold text-blue-700 text-sm">
                          {exp.company || 'Company'}
                        </p>
                      </div>
                      {(exp.startDate || exp.endDate || exp.current) && (
                        <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                        </div>
                      )}
                    </div>
                    {exp.description && exp.description.filter(desc => desc.trim()).length > 0 && (
                      <ul className="text-sm text-gray-600 leading-relaxed ml-4">
                        {exp.description.filter(desc => desc.trim()).map((desc, index) => (
                          <li key={index} className="list-disc mb-1">{desc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.some(project => project.name) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-blue-800">
              PROJECTS
            </h2>
            <div className="space-y-4">
              {data.projects
                .filter(project => project.name)
                .map((project) => (
                  <div key={project.id} className="relative pl-4 border-l-2 border-blue-200">
                    <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-1"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-base flex items-center">
                        {project.name}
                        {project.link && (
                          <ExternalLink className="w-3 h-3 ml-2 text-gray-500" />
                        )}
                      </h3>
                    </div>
                    {project.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.some(edu => edu.institution || edu.degree) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-blue-800">
              EDUCATION
            </h2>
            <div className="space-y-4">
              {data.education
                .filter(edu => edu.institution || edu.degree)
                .map((edu) => (
                  <div key={edu.id} className="relative pl-4 border-l-2 border-blue-200">
                    <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-1"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          {edu.degree || 'Degree'}
                        </h3>
                        <p className="font-semibold text-blue-700 text-sm">
                          {edu.institution || 'Institution'}
                          {edu.score && <span className="ml-2 text-gray-600">({edu.score})</span>}
                        </p>
                      </div>
                      {(edu.startDate || edu.endDate || edu.current) && (
                        <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-blue-800">
              ACHIEVEMENTS
            </h2>
            <ul className="space-y-2">
              {data.achievements.map((achievement, index) => (
                <li key={index} className="text-sm text-gray-600 leading-relaxed relative pl-4">
                  <span className="absolute left-0 top-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Extra Curricular */}
        {data.extraCurricular && data.extraCurricular.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-blue-800">
              EXTRA CURRICULAR
            </h2>
            <ul className="space-y-2">
              {data.extraCurricular.map((activity, index) => (
                <li key={index} className="text-sm text-gray-600 leading-relaxed relative pl-4">
                  <span className="absolute left-0 top-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default ResumePreview;