import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, Brain, ArrowRight, Sparkles, 
  Zap, Target, TrendingUp, ChevronDown, Play
} from 'lucide-react';

const Home: React.FC = () => {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Brain className="w-10 h-10" />,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your dosha constitution with 99% accuracy",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.1
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: "Precision Nutrition",
      description: "Personalized meal plans optimized for your unique metabolic profile",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.2
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Real-time Tracking",
      description: "Monitor your wellness journey with advanced biometric integration",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Instant Insights",
      description: "Get immediate feedback and recommendations powered by machine learning",
      gradient: "from-orange-500 to-red-500",
      delay: 0.4
    }
  ];





  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
      {/* Clean Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-green-50/30" />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-green-200/20 to-green-300/20 rounded-full blur-3xl"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.3s ease-out'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600">
              NutriVeda
            </span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link 
              to="/login" 
              className="px-6 py-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2 bg-green-600 rounded-full text-white font-semibold hover:bg-green-700 hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-green-50 rounded-full px-6 py-3 mb-8 border border-green-200">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">AI-Powered Ayurvedic Nutrition</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="text-gray-900">
                Transform Your
              </span>
              <br />
              <span className="text-green-600">
                Wellness Journey
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the future of personalized nutrition with our revolutionary AI-powered platform 
              that combines ancient Ayurvedic wisdom with cutting-edge technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/signup"
                className="group relative px-8 py-4 bg-green-600 rounded-full text-white font-semibold text-lg hover:bg-green-700 hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group flex items-center space-x-3 px-8 py-4 border border-green-200 rounded-full text-green-600 hover:bg-green-50 transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Play className="w-5 h-5 ml-1 text-green-600" />
                </div>
                <span className="font-medium">Watch Demo</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Features Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Next-Generation Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our advanced AI technology revolutionizes personalized nutrition
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" 
                     style={{ background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})` }} />
                <div className="relative bg-white border border-green-100 rounded-2xl p-8 hover:shadow-xl hover:border-green-200 transition-all duration-300">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dosha Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Discover Your Dosha
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock the secrets of your unique constitution with our AI-powered dosha analysis
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Vata', element: 'Air & Space', color: 'from-orange-500 to-red-500', description: 'Creative, energetic, and quick-thinking individuals who thrive on movement and change.' },
              { name: 'Pitta', element: 'Fire & Water', color: 'from-red-500 to-pink-500', description: 'Focused, ambitious, and goal-oriented leaders with strong digestive fire.' },
              { name: 'Kapha', element: 'Earth & Water', color: 'from-green-500 to-blue-500', description: 'Calm, stable, and nurturing souls who provide strength and endurance.' }
            ].map((dosha, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${dosha.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl`} />
                <div className="relative bg-white border border-green-100 rounded-2xl p-8 hover:shadow-xl hover:border-green-200 transition-all duration-300">
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-green-600">{dosha.name[0]}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{dosha.name}</h3>
                  <p className="text-green-600 mb-4 font-medium">{dosha.element}</p>
                  <p className="text-gray-600 leading-relaxed">{dosha.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands who have discovered the power of AI-driven Ayurvedic nutrition
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-green-600 rounded-full text-white font-semibold text-lg hover:bg-green-700 hover:shadow-xl transition-all duration-300 group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center space-y-2 text-gray-500"
        >
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;