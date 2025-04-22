import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  MessageSquare, 
  Upload, 
  Check, 
  ChevronRight,
  Wand2,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Navigation } from '../components/Navigation';

interface Template {
  subject: string;
  html: string;
}

export default function EmailCampaignPage() {
  const [step, setStep] = useState(1);
  const [requirement, setRequirement] = useState('');
  const [template, setTemplate] = useState<Template | null>(null);
  const [uploadedTemplate, setUploadedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const previewRef = useRef<HTMLIFrameElement>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/html': ['.html']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedTemplate(reader.result as string);
      };
      reader.readAsText(file);
    }
  });

  const parseRequirement = (input: string): { audience: string; scenario: string; type: string; goal: string } => {
    try {
      const parts = input.split(',').map(part => part.trim());
      
      if (parts.length < 4) {
        toast.error('Please provide all required information: audience, scenario, type, and goal');
        return { audience: '', scenario: '', type: '', goal: '' };
      }

      const [audience, scenario, type, goal] = parts;

      if (!audience || !scenario || !type || !goal) {
        toast.error('All fields (audience, scenario, type, goal) must be non-empty');
        return { audience: '', scenario: '', type: '', goal: '' };
      }

      return {
        audience: audience.replace(/^["']|["']$/g, ''),
        scenario: scenario.replace(/^["']|["']$/g, ''),
        type: type.replace(/^["']|["']$/g, ''),
        goal: goal.replace(/^["']|["']$/g, '')
      };
    } catch (error) {
      toast.error('Please use the format: audience, scenario, type, goal');
      return { audience: '', scenario: '', type: '', goal: '' };
    }
  };

  const generateTemplate = async (): Promise<void> => {
    try {
      setIsGenerating(true);
      const loadingToast = toast.loading('Generating email template...');

      const { audience, scenario, type, goal } = parseRequirement(requirement);
      
      if (!audience || !scenario || !type || !goal) {
        return;
      }

      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audience,
          scenario,
          type,
          goal,
          template: uploadedTemplate
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate template');
      }

      const data = await response.json();
      setTemplate(data);
      toast.success('Template generated successfully!', { id: loadingToast });
      setStep(2);
    } catch (error) {
      console.error('Error in generateTemplate:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate template');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = (html: string): void => {
    setPreviewHtml(html);
    
    if (previewRef.current) {
      const doc = previewRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  };

  const steps = [
    { number: 1, title: 'Requirement', icon: MessageSquare },
    { number: 2, title: 'Generation', icon: Wand2 }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0D0D1F] text-white">
      <Navigation />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Let's create your email template
          </h1>
          <p className="text-gray-400">Describe your requirements and let AI do the magic</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.number}>
                <div 
                  className={`flex items-center ${
                    step >= s.number ? 'text-[#00F0FF]' : 'text-gray-400'
                  }`}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${step >= s.number ? 'bg-[#00F0FF]/20' : 'bg-gray-800'}
                  `}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="ml-2">{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-[#1A1A2E] rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">What's your email about?</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Describe your requirements (comma-separated)
                  </label>
                  <textarea
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="e.g., Young professionals, Welcome email, Newsletter, Increase engagement"
                    className="w-full h-32 px-4 py-2 bg-[#2A2A3C] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
                  />
                </div>
                
                <div {...getRootProps()} className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-[#00F0FF] transition-colors">
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-400">
                    {uploadedTemplate ? 'Template uploaded!' : 'Drag & drop an HTML template (optional)'}
                  </p>
                </div>

                <button
                  onClick={generateTemplate}
                  disabled={isGenerating || !requirement}
                  className={`w-full py-3 px-6 rounded-lg font-medium ${
                    isGenerating || !requirement
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90'
                  }`}
                >
                  {isGenerating ? 'Generating...' : 'Generate Template'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && template && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-[#1A1A2E] rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Generated Email Template</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Subject:</h3>
                <p className="text-gray-300">{template.subject}</p>
              </div>

              <div className="bg-white rounded-lg overflow-hidden">
                <iframe
                  ref={previewRef}
                  srcDoc={template.html}
                  className="w-full h-[500px] border-0"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handlePreview(template.html)}
                  className="px-6 py-2 bg-[#00F0FF] text-black rounded-lg font-medium hover:bg-[#00F0FF]/90 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 