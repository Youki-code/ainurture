import React from 'react';
import { Building2, Users, ShoppingBag, Briefcase } from 'lucide-react';
import { FloatingElement } from '../components/FloatingElement';
import { Navigation } from '../components/Navigation';

export default function Solutions() {
  const solutions = [
    {
      icon: <Building2 className="w-12 h-12" />,
      title: "Enterprise",
      description: "Comprehensive lead management solution for large organizations",
      features: [
        "Custom AI models",
        "Advanced integration capabilities",
        "Dedicated support team",
        "Enterprise-grade security"
      ]
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Growth",
      description: "Perfect for growing businesses and marketing teams",
      features: [
        "Automated lead scoring",
        "Multi-channel campaigns",
        "Performance analytics",
        "Team collaboration tools"
      ]
    },
    {
      icon: <ShoppingBag className="w-12 h-12" />,
      title: "E-commerce",
      description: "Tailored for online stores and digital retailers",
      features: [
        "Shopping behavior analysis",
        "Cart abandonment recovery",
        "Product recommendations",
        "Customer journey tracking"
      ]
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Professional",
      description: "Ideal for small businesses and professionals",
      features: [
        "Easy-to-use interface",
        "Essential AI features",
        "Basic integrations",
        "Email support"
      ]
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent">
              Solutions for Every Scale
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan that matches your business needs and growth ambitions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <FloatingElement 
                key={index}
                className="h-full"
              >
                <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20 backdrop-blur-sm">
                  <div className="text-[#00F0FF] mb-6">{solution.icon}</div>
                  <h3 className="text-2xl font-semibold mb-4">{solution.title}</h3>
                  <p className="text-gray-400 mb-6">{solution.description}</p>
                  <ul className="space-y-3">
                    {solution.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </FloatingElement>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}