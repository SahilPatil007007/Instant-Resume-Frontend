import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link, Image } from '@react-pdf/renderer';

// Create styles for PDF
const createStyles = (template) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 10,
    lineHeight: 1.3,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
    borderBottom: '1pt solid #000000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  contactInfo: {
    fontSize: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 15,
  },
  contactItem: {
    marginHorizontal: 5,
  },
  contactLink: {
    marginHorizontal: 5,
    color: '#0066CC',
    textDecoration: 'none',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    alignSelf: 'center',
  },
  headerWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderBottom: '1pt solid #000000',
    paddingBottom: 10,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 20,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000000',
    borderBottom: '0.5pt solid #666666',
    paddingBottom: 2,
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 9,
    lineHeight: 1.3,
  },
  experienceItem: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  company: {
    fontSize: 9,
    color: '#000000',
  },
  dateRange: {
    fontSize: 8,
    color: '#000000',
    textAlign: 'right',
  },
  bulletList: {
    marginLeft: 12,
    marginTop: 2,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  bullet: {
    width: 8,
    fontSize: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    marginRight: 8,
    marginBottom: 2,
  },
  projectItem: {
    marginBottom: 6,
  },
  projectTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  projectLink: {
    color: '#0066CC',
    textDecoration: 'none',
  },
  technologies: {
    fontSize: 8,
    color: '#333333',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  educationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  degree: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  institution: {
    fontSize: 9,
    color: '#333333',
  },
  certificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  certTitle: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  certIssuer: {
    fontSize: 8,
    color: '#333333',
  },
  // Modern template specific styles
  modernHeader: {
    backgroundColor: template === 'modern' ? '#1E40AF' : '#FFFFFF',
    color: template === 'modern' ? '#FFFFFF' : '#000000',
    padding: template === 'modern' ? 20 : 0,
    marginBottom: 15,
  },
  modernName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: template === 'modern' ? '#FFFFFF' : '#000000',
    textAlign: 'center',
  },
  modernSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: template === 'modern' ? '#1E40AF' : '#000000',
    borderBottom: template === 'modern' ? '1pt solid #1E40AF' : '0.5pt solid #666666',
    paddingBottom: 2,
    textTransform: 'uppercase',
  },
  modernContactLink: {
    marginHorizontal: 5,
    color: template === 'modern' ? '#FFFFFF' : '#0066CC',
    textDecoration: 'none',
  },
  modernContactItem: {
    marginHorizontal: 5,
    color: template === 'modern' ? '#FFFFFF' : '#000000',
  },
});

const PDFResume = ({ data, template = 'classic' }) => {
  const styles = createStyles(template);
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

  const cleanUrl = (url) => {
    if (!url) return '';
    return url.replace(/^https?:\/\/(www\.)?/, '');
  };

  if (template === 'modern') {
    return (
      <Document>
        <Page size="A4" style={{ flexDirection: 'row', fontFamily: 'Helvetica' }}>
          {/* Left Sidebar */}
          <View style={{
            width: '35%',
            backgroundColor: '#1E40AF',
            color: '#FFFFFF',
            padding: 20,
            minHeight: '100%'
          }}>
            {/* Photo */}
            {data.personalInfo?.photoUrl && data.personalInfo?.showPhoto && (
              <View style={{ marginBottom: 20, alignItems: 'center' }}>
                <Image style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  border: '3pt solid rgba(255,255,255,0.2)'
                }} src={data.personalInfo.photoUrl} />
              </View>
            )}

            {/* Contact Info */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginBottom: 10,
                borderBottom: '1pt solid rgba(255,255,255,0.3)',
                paddingBottom: 5,
                textTransform: 'uppercase'
              }}>Contact</Text>
              <View style={{ fontSize: 9, lineHeight: 1.4 }}>
                {data.personalInfo?.email && (
                  <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ width: 12, fontSize: 8 }}>✉</Text>
                    <Link style={{ color: '#FFFFFF', fontSize: 8 }} src={`mailto:${data.personalInfo.email}`}>
                      {data.personalInfo.email}
                    </Link>
                  </View>
                )}
                {data.personalInfo?.phone && (
                  <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ width: 12, fontSize: 8 }}>📞</Text>
                    <Text style={{ fontSize: 8 }}>{data.personalInfo.phone}</Text>
                  </View>
                )}
                {data.personalInfo?.address && (
                  <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ width: 12, fontSize: 8 }}>📍</Text>
                    <Text style={{ fontSize: 8 }}>{data.personalInfo.address}</Text>
                  </View>
                )}
                {data.personalInfo?.linkedin && (
                  <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ width: 12, fontSize: 8 }}>💼</Text>
                    <Link style={{ color: '#FFFFFF', fontSize: 8 }} src={data.personalInfo.linkedin}>
                      {cleanUrl(data.personalInfo.linkedin)}
                    </Link>
                  </View>
                )}
                {data.personalInfo?.github && (
                  <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ width: 12, fontSize: 8 }}>🔗</Text>
                    <Link style={{ color: '#FFFFFF', fontSize: 8 }} src={data.personalInfo.github}>
                      {cleanUrl(data.personalInfo.github)}
                    </Link>
                  </View>
                )}
                {data.personalInfo?.portfolio && (
                  <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ width: 12, fontSize: 8 }}>🌐</Text>
                    <Link style={{ color: '#FFFFFF', fontSize: 8 }} src={data.personalInfo.portfolio}>
                      {cleanUrl(data.personalInfo.portfolio)}
                    </Link>
                  </View>
                )}
              </View>
            </View>

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  borderBottom: '1pt solid rgba(255,255,255,0.3)',
                  paddingBottom: 5,
                  textTransform: 'uppercase'
                }}>Skills</Text>
                <View>
                  {data.skills.map((skill, index) => (
                    <View key={index} style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      padding: 4,
                      marginBottom: 3,
                      borderRadius: 2
                    }}>
                      <Text style={{ fontSize: 8 }}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.some(cert => cert.title) && (
              <View>
                <Text style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  borderBottom: '1pt solid rgba(255,255,255,0.3)',
                  paddingBottom: 5,
                  textTransform: 'uppercase'
                }}>Certifications</Text>
                {data.certifications
                  .filter(cert => cert.title)
                  .slice(0, 4)
                  .map((cert, index) => (
                    <View key={cert.id || index} style={{ marginBottom: 8 }}>
                      <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{cert.title}</Text>
                      {cert.issuer && (
                        <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.8)' }}>{cert.issuer}</Text>
                      )}
                      {cert.date && (
                        <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.6)' }}>{formatDate(cert.date)}</Text>
                      )}
                    </View>
                  ))}
              </View>
            )}
          </View>

          {/* Right Content */}
          <View style={{ width: '65%', padding: 25, backgroundColor: '#FFFFFF' }}>
            {/* Name and Title */}
            <View style={{ marginBottom: 25 }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: 8
              }}>
                {data.personalInfo?.name || 'YOUR NAME'}
              </Text>
              <View style={{
                height: 3,
                width: 60,
                backgroundColor: '#1E40AF',
                marginBottom: 15
              }} />
            </View>

            {/* Professional Summary */}
            {data.summary && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#1E40AF',
                  marginBottom: 8,
                  textTransform: 'uppercase'
                }}>Profile</Text>
                <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#374151' }}>
                  {data.summary}
                </Text>
              </View>
            )}

            {/* Professional Experience */}
            {data.experience && data.experience.some(exp => exp.company || exp.title) && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#1E40AF',
                  marginBottom: 12,
                  textTransform: 'uppercase'
                }}>Experience</Text>
                {data.experience
                  .filter(exp => exp.company || exp.title)
                  .map((exp, index) => (
                    <View key={exp.id || index} style={{
                      marginBottom: 15,
                      paddingLeft: 15,
                      borderLeft: '2pt solid #DBEAFE',
                      position: 'relative'
                    }}>
                      <View style={{
                        position: 'absolute',
                        left: -4,
                        top: 4,
                        width: 6,
                        height: 6,
                        backgroundColor: '#1E40AF',
                        borderRadius: 3
                      }} />
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 5
                      }}>
                        <View>
                          <Text style={{
                            fontSize: 11,
                            fontWeight: 'bold',
                            color: '#1F2937'
                          }}>
                            {exp.title || 'Position'}
                          </Text>
                          <Text style={{
                            fontSize: 10,
                            fontWeight: 'bold',
                            color: '#1E40AF'
                          }}>
                            {exp.company || 'Company'}
                          </Text>
                        </View>
                        {(exp.startDate || exp.endDate || exp.current) && (
                          <Text style={{
                            fontSize: 8,
                            color: '#6B7280',
                            backgroundColor: '#F3F4F6',
                            padding: 3,
                            borderRadius: 2
                          }}>
                            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                          </Text>
                        )}
                      </View>
                      {exp.description && exp.description.filter(desc => desc.trim()).length > 0 && (
                        <View style={{ marginLeft: 10 }}>
                          {exp.description
                            .filter(desc => desc.trim())
                            .slice(0, 3)
                            .map((desc, descIndex) => (
                              <View key={descIndex} style={{
                                flexDirection: 'row',
                                marginBottom: 2
                              }}>
                                <Text style={{ fontSize: 8, marginRight: 5, color: '#6B7280' }}>•</Text>
                                <Text style={{ fontSize: 9, lineHeight: 1.3, color: '#374151', flex: 1 }}>
                                  {desc}
                                </Text>
                              </View>
                            ))}
                        </View>
                      )}
                    </View>
                  ))}
              </View>
            )}

            {/* Projects */}
            {data.projects && data.projects.some(project => project.name) && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#1E40AF',
                  marginBottom: 12,
                  textTransform: 'uppercase'
                }}>Projects</Text>
                {data.projects
                  .filter(project => project.name)
                  .slice(0, 2)
                  .map((project, index) => (
                    <View key={project.id || index} style={{
                      marginBottom: 12,
                      paddingLeft: 15,
                      borderLeft: '2pt solid #DBEAFE',
                      position: 'relative'
                    }}>
                      <View style={{
                        position: 'absolute',
                        left: -4,
                        top: 4,
                        width: 6,
                        height: 6,
                        backgroundColor: '#1E40AF',
                        borderRadius: 3
                      }} />
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                        <Text style={{
                          fontSize: 11,
                          fontWeight: 'bold',
                          color: '#1F2937'
                        }}>
                          {project.name}
                        </Text>
                        {project.link && (
                          <Link style={{
                            marginLeft: 8,
                            fontSize: 8,
                            color: '#1E40AF'
                          }} src={project.link}>
                            [Link]
                          </Link>
                        )}
                      </View>
                      {project.technologies && project.technologies.length > 0 && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5 }}>
                          {project.technologies.slice(0, 4).map((tech, techIndex) => (
                            <Text key={techIndex} style={{
                              fontSize: 7,
                              backgroundColor: '#DBEAFE',
                              color: '#1E40AF',
                              padding: 2,
                              marginRight: 3,
                              marginBottom: 2,
                              borderRadius: 2
                            }}>
                              {tech}
                            </Text>
                          ))}
                        </View>
                      )}
                      {project.description && project.description.filter(desc => desc.trim()).length > 0 && (
                        <View style={{ marginLeft: 10 }}>
                          {project.description
                            .filter(desc => desc.trim())
                            .slice(0, 2)
                            .map((desc, descIndex) => (
                              <View key={descIndex} style={{
                                flexDirection: 'row',
                                marginBottom: 2
                              }}>
                                <Text style={{ fontSize: 8, marginRight: 5, color: '#6B7280' }}>•</Text>
                                <Text style={{ fontSize: 9, lineHeight: 1.3, color: '#374151', flex: 1 }}>
                                  {desc}
                                </Text>
                              </View>
                            ))}
                        </View>
                      )}
                    </View>
                  ))}
              </View>
            )}

            {/* Education */}
            {data.education && data.education.some(edu => edu.institution || edu.degree) && (
              <View style={{ marginBottom: 15 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#1E40AF',
                  marginBottom: 10,
                  textTransform: 'uppercase'
                }}>Education</Text>
                {data.education
                  .filter(edu => edu.institution || edu.degree)
                  .map((edu, index) => (
                    <View key={edu.id || index} style={{
                      marginBottom: 10,
                      paddingLeft: 15,
                      borderLeft: '2pt solid #DBEAFE',
                      position: 'relative'
                    }}>
                      <View style={{
                        position: 'absolute',
                        left: -4,
                        top: 4,
                        width: 6,
                        height: 6,
                        backgroundColor: '#1E40AF',
                        borderRadius: 3
                      }} />
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}>
                        <View>
                          <Text style={{
                            fontSize: 11,
                            fontWeight: 'bold',
                            color: '#1F2937'
                          }}>
                            {edu.degree || 'Degree'}
                          </Text>
                          <Text style={{
                            fontSize: 10,
                            fontWeight: 'bold',
                            color: '#1E40AF'
                          }}>
                            {edu.institution || 'Institution'}
                            {edu.score && <Text style={{ color: '#6B7280' }}> ({edu.score})</Text>}
                          </Text>
                        </View>
                        {(edu.startDate || edu.endDate || edu.current) && (
                          <Text style={{
                            fontSize: 8,
                            color: '#6B7280',
                            backgroundColor: '#F3F4F6',
                            padding: 3,
                            borderRadius: 2
                          }}>
                            {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {/* Achievements */}
            {data.achievements && data.achievements.length > 0 && (
              <View style={{ marginBottom: 15 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#1E40AF',
                  marginBottom: 8,
                  textTransform: 'uppercase'
                }}>Achievements</Text>
                <View style={{ marginLeft: 10 }}>
                  {data.achievements.slice(0, 3).map((achievement, index) => (
                    <View key={index} style={{
                      flexDirection: 'row',
                      marginBottom: 3
                    }}>
                      <Text style={{ fontSize: 8, marginRight: 5, color: '#1E40AF' }}>•</Text>
                      <Text style={{ fontSize: 9, lineHeight: 1.3, color: '#374151', flex: 1 }}>
                        {achievement}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Extra Curricular */}
            {data.extraCurricular && data.extraCurricular.length > 0 && (
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#1E40AF',
                  marginBottom: 8,
                  textTransform: 'uppercase'
                }}>Extra Curricular</Text>
                <View style={{ marginLeft: 10 }}>
                  {data.extraCurricular.slice(0, 2).map((activity, index) => (
                    <View key={index} style={{
                      flexDirection: 'row',
                      marginBottom: 3
                    }}>
                      <Text style={{ fontSize: 8, marginRight: 5, color: '#1E40AF' }}>•</Text>
                      <Text style={{ fontSize: 9, lineHeight: 1.3, color: '#374151', flex: 1 }}>
                        {activity}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {data.personalInfo?.photoUrl && data.personalInfo?.showPhoto ? (
          <View style={[styles.headerWithImage, template === 'modern' && styles.modernHeader]}>
            <View style={styles.imageContainer}>
              <Image style={styles.profileImage} src={data.personalInfo.photoUrl} />
            </View>
            <View style={styles.headerContent}>
              <Text style={template === 'modern' ? styles.modernName : styles.name}>
                {data.personalInfo?.name || 'YOUR NAME'}
              </Text>
              <View style={styles.contactInfo}>
                {data.personalInfo?.email && (
                  <Link style={template === 'modern' ? styles.modernContactLink : styles.contactLink} src={`mailto:${data.personalInfo.email}`}>
                    {data.personalInfo.email}
                  </Link>
                )}
                {data.personalInfo?.phone && (
                  <Text style={template === 'modern' ? styles.modernContactItem : styles.contactItem}>{data.personalInfo.phone}</Text>
                )}
                {data.personalInfo?.address && (
                  <Text style={template === 'modern' ? styles.modernContactItem : styles.contactItem}>{data.personalInfo.address}</Text>
                )}
                {data.personalInfo?.linkedin && (
                  <Link style={template === 'modern' ? styles.modernContactLink : styles.contactLink} src={data.personalInfo.linkedin}>
                    LinkedIn: {cleanUrl(data.personalInfo.linkedin)}
                  </Link>
                )}
                {data.personalInfo?.github && (
                  <Link style={template === 'modern' ? styles.modernContactLink : styles.contactLink} src={data.personalInfo.github}>
                    GitHub: {cleanUrl(data.personalInfo.github)}
                  </Link>
                )}
                {data.personalInfo?.portfolio && (
                  <Link style={template === 'modern' ? styles.modernContactLink : styles.contactLink} src={data.personalInfo.portfolio}>
                    Portfolio: {cleanUrl(data.personalInfo.portfolio)}
                  </Link>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.header, template === 'modern' && styles.modernHeader]}>
            <Text style={template === 'modern' ? styles.modernName : styles.name}>
              {data.personalInfo?.name || 'YOUR NAME'}
            </Text>
            <View style={styles.contactInfo}>
              {data.personalInfo?.email && (
                <Link style={template === 'modern' ? styles.modernContactLink : styles.contactLink} src={`mailto:${data.personalInfo.email}`}>
                  {data.personalInfo.email}
                </Link>
              )}
              {data.personalInfo?.phone && (
                <Text style={template === 'modern' ? styles.modernContactItem : styles.contactItem}>{data.personalInfo.phone}</Text>
              )}
              {data.personalInfo?.address && (
                <Text style={template === 'modern' ? styles.modernContactItem : styles.contactItem}>{data.personalInfo.address}</Text>
              )}
              {data.personalInfo?.linkedin && (
                <Link style={template === 'modern' ? styles.modernContactLink : styles.contactLink} src={data.personalInfo.linkedin}>
                  LinkedIn: {cleanUrl(data.personalInfo.linkedin)}
                </Link>
              )}
              {data.personalInfo?.github && (
                <Link style={template === 'modern' ? styles.modernContactLink : styles.contactLink} src={data.personalInfo.github}>
                  GitHub: {cleanUrl(data.personalInfo.github)}
                </Link>
              )}
              {data.personalInfo?.portfolio && (
                <Link style={template === 'modern' ? styles.modernContactLink : styles.contactLink} src={data.personalInfo.portfolio}>
                  Portfolio: {cleanUrl(data.personalInfo.portfolio)}
                </Link>
              )}
            </View>
          </View>
        )}

        {/* Professional Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={template === 'modern' ? styles.modernSectionTitle : styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.sectionContent}>{data.summary}</Text>
          </View>
        )}

        {/* Technical Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={template === 'modern' ? styles.modernSectionTitle : styles.sectionTitle}>Technical Skills</Text>
            <Text style={styles.sectionContent}>
              {data.skills.join(' • ')}
            </Text>
          </View>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.some(exp => exp.company || exp.title) && (
          <View style={styles.section}>
            <Text style={template === 'modern' ? styles.modernSectionTitle : styles.sectionTitle}>Professional Experience</Text>
            {data.experience
              .filter(exp => exp.company || exp.title)
              .map((exp, index) => (
                <View key={exp.id || index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <View>
                      <Text style={styles.jobTitle}>
                        {exp.title || 'Position'} | {exp.company || 'Company'}
                      </Text>
                    </View>
                    {(exp.startDate || exp.endDate || exp.current) && (
                      <Text style={styles.dateRange}>
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </Text>
                    )}
                  </View>
                  {exp.description && exp.description.filter(desc => desc.trim()).length > 0 && (
                    <View style={styles.bulletList}>
                      {exp.description
                        .filter(desc => desc.trim())
                        .slice(0, 4)
                        .map((desc, descIndex) => (
                          <View key={descIndex} style={styles.bulletItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>{desc}</Text>
                          </View>
                        ))}
                    </View>
                  )}
                </View>
              ))}
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.some(project => project.name) && (
          <View style={styles.section}>
            <Text style={template === 'modern' ? styles.modernSectionTitle : styles.sectionTitle}>Projects</Text>
            {data.projects
              .filter(project => project.name)
              .slice(0, 3)
              .map((project, index) => (
                <View key={project.id || index} style={styles.projectItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Text style={styles.projectTitle}>{project.name}</Text>
                    {project.link && (
                      <Link style={[styles.projectLink, { marginLeft: 5, fontSize: 8 }]} src={project.link}>
                        [Link]
                      </Link>
                    )}
                  </View>
                  {project.technologies && project.technologies.length > 0 && (
                    <Text style={styles.technologies}>
                      Technologies: {project.technologies.join(', ')}
                    </Text>
                  )}
                  {project.description && project.description.filter(desc => desc.trim()).length > 0 && (
                    <View style={styles.bulletList}>
                      {project.description
                        .filter(desc => desc.trim())
                        .slice(0, 3)
                        .map((desc, descIndex) => (
                          <View key={descIndex} style={styles.bulletItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>{desc}</Text>
                          </View>
                        ))}
                    </View>
                  )}
                </View>
              ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.some(edu => edu.institution || edu.degree) && (
          <View style={styles.section}>
            <Text style={template === 'modern' ? styles.modernSectionTitle : styles.sectionTitle}>Education</Text>
            {data.education
              .filter(edu => edu.institution || edu.degree)
              .map((edu, index) => (
                <View key={edu.id || index} style={styles.educationItem}>
                  <View>
                    <Text style={styles.degree}>
                      {edu.degree || 'Degree'} | {edu.institution || 'Institution'}
                    </Text>
                    {edu.score && (
                      <Text style={styles.institution}>Score: {edu.score}</Text>
                    )}
                  </View>
                  {(edu.startDate || edu.endDate || edu.current) && (
                    <Text style={styles.dateRange}>
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </Text>
                  )}
                </View>
              ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.some(cert => cert.title) && (
          <View style={styles.section}>
            <Text style={template === 'modern' ? styles.modernSectionTitle : styles.sectionTitle}>Certifications</Text>
            {data.certifications
              .filter(cert => cert.title)
              .slice(0, 4)
              .map((cert, index) => (
                <View key={cert.id || index} style={styles.certificationItem}>
                  <View>
                    <Text style={styles.certTitle}>{cert.title}</Text>
                    {cert.issuer && (
                      <Text style={styles.certIssuer}>{cert.issuer}</Text>
                    )}
                  </View>
                  {cert.date && (
                    <Text style={styles.dateRange}>{formatDate(cert.date)}</Text>
                  )}
                </View>
              ))}
          </View>
        )}

        {/* Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={template === 'modern' ? styles.modernSectionTitle : styles.sectionTitle}>Achievements</Text>
            <View style={styles.bulletList}>
              {data.achievements.slice(0, 4).map((achievement, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{achievement}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Extra Curricular */}
        {data.extraCurricular && data.extraCurricular.length > 0 && (
          <View style={styles.section}>
            <Text style={template === 'modern' ? styles.modernSectionTitle : styles.sectionTitle}>Extracurricular Activities</Text>
            <View style={styles.bulletList}>
              {data.extraCurricular.slice(0, 3).map((activity, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{activity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PDFResume;
