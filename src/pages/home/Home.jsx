import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Brain, 
  Zap, 
  Palette, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'ATS-Friendly Templates',
      description: 'Our templates are optimized to pass Applicant Tracking Systems with high success rates.',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Brain,
      title: 'Easy Writing with AI',
      description: 'Get smart suggestions and content recommendations powered by artificial intelligence.',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Zap,
      title: 'Instant Resume Generation',
      description: 'Create professional resumes in minutes with our streamlined process.',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      icon: Palette,
      title: 'Modern & Classic Styles',
      description: 'Choose from a variety of professionally designed templates that suit any industry.',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Resumes Created' },
    { number: '95%', label: 'Success Rate' },
    { number: '5⭐', label: 'Average Rating' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                AI-Powered{' '}
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Resume Builder
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                <span className="font-semibold text-primary-600">Instant.</span>{' '}
                <span className="font-semibold text-secondary-600">ATS-Friendly.</span>{' '}
                <span className="font-semibold text-purple-600">Modern.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  to="/create-resume"
                  className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
                >
                  <FileText className="h-5 w-5" />
                  <span>Create Resume</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/your-resumes"
                  className="btn-outline text-lg px-8 py-4"
                >
                  View Examples
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven design principles
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card card-hover text-center group"
                >
                  <div className={`inline-flex p-3 rounded-full ${feature.bg} mb-6`}>
                    <IconComponent className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center glassmorphic rounded-2xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to build your perfect resume?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of professionals who have successfully landed their dream jobs
          </p>
          <Link
            to="/create-resume"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 group"
          >
            <FileText className="h-5 w-5" />
            <span>Start Building Now</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;