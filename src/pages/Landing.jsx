import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Calendar, Shield, TrendingUp, ArrowRight, HeartPulse } from 'lucide-react';
import { RECOVERY_PATHS } from '../constants/recovery';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Recovery Tracking',
      description: 'Track your recovery journey for substances, behaviors, or anything else you want to recover from, and celebrate every milestone.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Daily Journaling',
      description: 'Reflect on your journey, track moods, cravings, and triggers with AI-powered insights.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with others on similar paths in a safe, anonymous community space.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Shield,
      title: 'Harm Reduction',
      description: 'Access evidence-based information and resources for safer recovery practices.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: TrendingUp,
      title: 'Step Work & Progress',
      description: 'Guided step work for 12-step programs, SMART Recovery, and other frameworks.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: HeartPulse,
      title: 'Personalized Path',
      description: 'Choose your recovery approach: AA, NA, SMART, Harm Reduction, MAT, and more.',
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero / Intro Landing Page Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-recovery-DEFAULT rounded-full mb-6">
            <HeartPulse className="w-16 h-16 text-recovery-DEFAULT" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Recovery At Ease
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your personalized recovery companion. Track your journey, connect with community,
            and access resources tailored to your path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login', { state: { startMode: 'signup' } })}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary text-lg px-8 py-4"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for Your Recovery Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recovery Paths Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Support for Every Recovery Path
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We respect and support all paths to recovery. Choose what works for you.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {RECOVERY_PATHS.map((path) => (
              <div key={path.id} className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-700">{path.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-recovery-DEFAULT py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-black-100 mb-8">
            Join thousands of people taking control of their recovery, one day at a time.
          </p>
          <button
            onClick={() => navigate('/login', { state: { startMode: 'signup' } })}
            className="bg-white text-recovery-DEFAULT hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Get Started Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Recovery At Ease. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

