import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, RefreshCcw } from 'lucide-react';
import { FloatingElement } from '../components/FloatingElement';
import { supabase } from '../lib/supabase';
import { contactSchema } from '../lib/validation';
import { SuccessMessage } from '../components/SuccessMessage';
import toast from 'react-hot-toast';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate form data
      const validatedData = contactSchema.parse(formData);
      
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          ...validatedData,
          user_id: user?.id || null
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      toast.success('Thank you for your message! We will get back to you soon.');
      
    } catch (error) {
      console.error('Contact submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "contact@ainurture.com"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      value: "+1 (555) 123-4567"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      value: "123 AI Street, Tech Valley, CA 94025"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions? We're here to help you transform your lead nurturing process.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="text-[#00F0FF]">{info.icon}</div>
                  <div>
                    <p className="text-sm text-gray-400">{info.title}</p>
                    <p className="text-white">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20 backdrop-blur-sm">
            {isSubmitted ? (
              <SuccessMessage message="Thank you for your submission. We will contact you shortly." />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-[#00F0FF]/20 rounded-lg py-3 px-4 focus:outline-none focus:border-[#00F0FF]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-[#00F0FF]/20 rounded-lg py-3 px-4 focus:outline-none focus:border-[#00F0FF]"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-[#00F0FF]/20 rounded-lg py-3 px-4 focus:outline-none focus:border-[#00F0FF]"
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-white/5 border border-[#00F0FF]/20 rounded-lg py-3 px-4 focus:outline-none focus:border-[#00F0FF]"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}