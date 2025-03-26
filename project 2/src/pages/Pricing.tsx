import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle, Zap, Users, Shield, Clock, Database, Headphones, Star } from 'lucide-react';
import { FloatingElement } from '../components/FloatingElement';

interface PricingFeature {
  name: string;
  individual: boolean;
  business: boolean;
  description?: string;
}

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const features: PricingFeature[] = [
    { name: 'AI Lead Scoring', individual: true, business: true, description: 'Automated lead qualification and ranking' },
    { name: 'Basic Analytics', individual: true, business: true, description: 'Essential performance metrics' },
    { name: 'Self-Evolving Email/Text Campaigns', individual: true, business: true, description: 'AI-powered campaigns that learn and adapt automatically' },
    { name: 'Cloud Storage', individual: true, business: true, description: '10GB for Individual, Unlimited for Business' },
    { name: 'Team Management', individual: false, business: true, description: 'Collaborate with unlimited team members' },
    { name: 'Advanced Security', individual: false, business: true, description: 'Enterprise-grade security features' },
    { name: 'Priority Support', individual: false, business: true, description: '24/7 dedicated support team' },
    { name: 'Custom Integration', individual: false, business: true, description: 'Connect with your existing tools' },
    { name: 'API Access', individual: false, business: true, description: 'Full API access with documentation' },
    { name: 'White Labeling', individual: false, business: true, description: 'Custom branding options' }
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions.'
    },
    {
      question: 'Can I switch between plans?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. The billing will be prorated accordingly.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial for both Individual and Business plans. No credit card required.'
    },
    {
      question: 'What happens when I exceed my storage limit?',
      answer: 'Individual plan users will be notified when approaching the limit. Business plans include unlimited storage.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our service.'
    }
  ];

  const companyLogos = [
    { name: 'TechCorp', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=150&h=150' },
    { name: 'InnovateAI', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=150&h=150' },
    { name: 'DataFlow', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=150&h=150' },
    { name: 'LeadGen', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=150&h=150' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your business needs. No hidden fees.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-lg ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-16 h-8 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#A742FF] p-1 transition-colors"
          >
            <motion.div
              animate={{ x: isAnnual ? 32 : 0 }}
              className="w-6 h-6 rounded-full bg-white"
            />
          </button>
          <span className={`text-lg ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
            Annual <span className="text-[#00F0FF]">(Save 20%)</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          {/* Individual Plan */}
          <FloatingElement className="h-full">
            <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-6 right-6 px-3 py-1 bg-[#00F0FF]/20 rounded-full text-[#00F0FF] text-sm">
                Most Popular
              </div>
              <h3 className="text-2xl font-semibold mb-2">Individual</h3>
              <p className="text-gray-400 mb-6">Perfect for solo entrepreneurs</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">${isAnnual ? '15' : '19'}</span>
                <span className="text-gray-400">/month</span>
                {isAnnual && (
                  <p className="text-[#00F0FF] text-sm mt-2">Billed annually (${15 * 12}/year)</p>
                )}
              </div>
              <button className="w-full py-4 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] rounded-lg font-semibold mb-8 hover:scale-105 transition-transform">
                Start Free Trial
              </button>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  feature.individual && (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00F0FF] flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </li>
                  )
                ))}
              </ul>
            </div>
          </FloatingElement>

          {/* Business Plan */}
          <FloatingElement className="h-full">
            <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-6 right-6 px-3 py-1 bg-[#A742FF]/20 rounded-full text-[#A742FF] text-sm">
                Enterprise Grade
              </div>
              <h3 className="text-2xl font-semibold mb-2">Business</h3>
              <p className="text-gray-400 mb-6">For growing teams and businesses</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">${isAnnual ? '39' : '49'}</span>
                <span className="text-gray-400">/month</span>
                {isAnnual && (
                  <p className="text-[#A742FF] text-sm mt-2">Billed annually (${39 * 12}/year)</p>
                )}
              </div>
              <button className="w-full py-4 bg-white/10 border border-[#A742FF] rounded-lg font-semibold mb-8 hover:bg-white/20 transition-colors">
                Contact Sales
              </button>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  feature.business && (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#A742FF] flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </li>
                  )
                ))}
              </ul>
            </div>
          </FloatingElement>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-5xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#00F0FF]/20">
                  <th className="py-4 px-6 text-left">Feature</th>
                  <th className="py-4 px-6 text-center">Individual</th>
                  <th className="py-4 px-6 text-center">Business</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-[#00F0FF]/10">
                    <td className="py-4 px-6">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {feature.individual ? (
                        <Check className="w-5 h-5 text-[#00F0FF] mx-auto" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.business ? (
                        <Check className="w-5 h-5 text-[#A742FF] mx-auto" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-24">
          <h2 className="text-2xl font-semibold mb-8">Trusted by Industry Leaders</h2>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {companyLogos.map((company, index) => (
              <img
                key={index}
                src={company.url}
                alt={company.name}
                className="h-12 w-auto opacity-50 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="rounded-lg bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium">{faq.question}</span>
                  <HelpCircle className={`w-5 h-5 transition-transform ${
                    expandedFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: expandedFaq === index ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-4 text-gray-400">{faq.answer}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mb-24">
          <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#00F0FF]" />
              <p className="font-medium">30-Day Money-Back Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}