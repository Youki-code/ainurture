import React from 'react';
import { Cpu, Workflow, Sparkles, Zap, Brain, BarChart3 } from 'lucide-react';
import { FloatingElement } from '../components/FloatingElement';

export function Features() {
  const features = [
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Advanced AI Processing",
      description: "State-of-the-art machine learning algorithms process and analyze lead behavior in real-time."
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Automated Workflows",
      description: "Intelligent automation handles lead nurturing sequences with precision and efficiency."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Smart Personalization",
      description: "Dynamic content adaptation based on individual lead preferences and behaviors."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Instant insights and performance metrics to optimize your lead conversion strategy."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Predictive Intelligence",
      description: "AI-powered predictions for lead scoring and conversion probability."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Tracking",
      description: "Comprehensive analytics dashboard for monitoring campaign effectiveness."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent">
            Intelligent Features
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the power of AI-driven lead nurturing with our comprehensive suite of features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FloatingElement 
              key={index}
              className="h-full"
            >
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20 backdrop-blur-sm">
                <div className="text-[#00F0FF] mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </FloatingElement>
          ))}
        </div>
      </div>
    </div>
  );
}