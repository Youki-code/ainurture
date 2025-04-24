import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import EmailEditor from 'react-email-editor';
import { toPng } from 'html-to-image';
import { 
  Mail, 
  MessageSquare, 
  Upload, 
  RefreshCw, 
  Check, 
  ChevronRight,
  Wand2,
  TestTube,
  Settings,
  Eye,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateEmailTemplate } from '../lib/claude';
import { useAuthStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { checkAnthropicApiKey } from '../lib/checkApiKey';

interface Template {
  id: string;
  html: string;
  subject: string;
  thumbnail: string;
  selected: boolean;
}

export function EmailCampaign() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [requirement, setRequirement] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [uploadedTemplate, setUploadedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [experimentSetup, setExperimentSetup] = useState({
    testDuration: 7,
    audienceSize: 1000,
    startDate: new Date().toISOString().split('T')[0]
  });

  const emailEditorRef = useRef<any>(null);
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
      console.log('Parsing requirement:', input);
      
      // Split by commas and clean up each part
      const parts = input.split(',').map(part => part.trim());
      
      console.log('Split parts:', parts);
      
      // Ensure we have all required parts
      if (parts.length < 4) {
        throw new Error('Please provide all required information: audience, scenario, type, and goal');
      }

      const [audience, scenario, type, goal] = parts;

      // Validate each part
      if (!audience || !scenario || !type || !goal) {
        throw new Error('All fields (audience, scenario, type, goal) must be non-empty');
      }

      // Clean and format the input
      const result = {
        audience: audience.replace(/^["']|["']$/g, ''),
        scenario: scenario.replace(/^["']|["']$/g, ''),
        type: type.replace(/^["']|["']$/g, ''),
        goal: goal.replace(/^["']|["']$/g, '')
      };

      console.log('Parsed requirement:', result);
      return result;
    } catch (error) {
      console.error('Error parsing requirement:', error);
      throw new Error('Invalid input format. Please use: audience, scenario, type, goal');
    }
  };

  const generateTemplates = async () => {
    try {
      console.log('Starting template generation...');
      
      // First check if API key is valid
      const isValidKey = await checkAnthropicApiKey();
      if (!isValidKey) {
        console.log('API key validation failed');
        return;
      }

      setIsGenerating(true);
      const loadingToast = toast.loading('Generating email templates...');

      // Parse requirement with better error handling
      const { audience, scenario, type, goal } = parseRequirement(requirement);

      console.log('Generating templates with parameters:', { audience, scenario, type, goal });

      // Generate three variations
      // const templates = await Promise.all([
      //   generateEmailTemplate(audience, scenario, type, goal, uploadedTemplate || undefined),
      //   generateEmailTemplate(audience, scenario, type, goal, uploadedTemplate || undefined),
      //   generateEmailTemplate(audience, scenario, type, goal, uploadedTemplate || undefined)
      // ]);
      const templates =  [generateEmailTemplate(audience, scenario, type, goal, uploadedTemplate || undefined)]

      console.log('Generated templates:', templates);

      // Process and validate templates
      const processedTemplates = templates.map((template, index) => ({
        id: `template-${index + 1}`,
        html: template.html,
        subject: template.subject,
        thumbnail: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f0f0f0"/></svg>')}`,
        selected: false
      }));

      setTemplates(processedTemplates);
      toast.success('Templates generated successfully!', { id: loadingToast });
      setStep(2);
    } catch (error) {
      console.error('Error in generateTemplates:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate templates');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelection = (templateId: string) => {
    setTemplates(prev => prev.map(template => ({
      ...template,
      selected: template.id === templateId ? !template.selected : template.selected
    })));
  };

  const handlePreview = (html: string) => {
    setPreviewHtml(html);
    
    // Update preview iframe content
    if (previewRef.current) {
      const doc = previewRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  };

  const saveExperiment = async () => {
    try {
      const selectedTemplates = templates.filter(t => t.selected);
      if (selectedTemplates.length !== 2) {
        throw new Error('Please select exactly 2 templates for A/B testing');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('experiments').insert({
        user_id: user.id,
        templates: selectedTemplates,
        setup: experimentSetup,
        status: 'pending',
        created_at: new Date()
      });

      if (error) throw error;

      toast.success('Experiment created successfully!');
      setStep(3);
    } catch (error) {
      console.error('Error saving experiment:', error);
      toast.error('Failed to save experiment. Please try again.');
    }
  };

  const steps = [
    { number: 1, title: 'Requirement', icon: MessageSquare },
    { number: 2, title: 'Generation', icon: Wand2 },
    { number: 3, title: 'Experiment', icon: TestTube }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Hey{' '}
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent">
              {user?.displayName || 'there'}
            </span>
            , let's create your email campaign
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
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white/5 rounded-lg p-6 border border-[#00F0FF]/20">
              <h2 className="text-2xl font-semibold mb-4">Describe Your Campaign</h2>
              
              <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-400">
                    Format your input exactly as: <span className="font-mono">audience, scenario, type, goal</span>
                  </p>
                  <p className="text-xs text-blue-300 mt-1">
                    Example: "New customers, abandoned shopping cart, reminder email, complete purchase"
                  </p>
                </div>
              </div>

              <textarea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className="w-full h-40 bg-white/5 border border-[#00F0FF]/20 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#00F0FF]"
                placeholder="Format: audience, scenario, type, goal"
              />

              <div className="mt-6">
                <div {...getRootProps()} className="border-2 border-dashed border-[#00F0FF]/20 rounded-lg p-6 text-center cursor-pointer hover:border-[#00F0FF]/40 transition-colors">
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 text-[#00F0FF] mx-auto mb-2" />
                  <p className="text-gray-400">Optional: Upload a reference HTML email template</p>
                  <p className="text-sm text-gray-500">Drag & drop or click to select</p>
                </div>
              </div>

              {uploadedTemplate && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Reference Template</h3>
                    <button
                      onClick={() => handlePreview(uploadedTemplate)}
                      className="flex items-center gap-2 text-[#00F0FF] hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                  <div className="max-h-40 overflow-auto">
                    <pre className="text-sm text-gray-400">{uploadedTemplate}</pre>
                  </div>
                </div>
              )}

              <button
                onClick={generateTemplates}
                disabled={!requirement || isGenerating}
                className={`
                  mt-6 w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2
                  ${!requirement || isGenerating
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#00F0FF] to-[#A742FF] hover:opacity-90'
                  }
                `}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Templates
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white/5 rounded-lg p-6 border border-[#00F0FF]/20">
              <h2 className="text-2xl font-semibold mb-6">Generated Templates</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, index) => (
                  <div key={template.id} className="relative">
                    <div 
                      className={`
                        rounded-lg overflow-hidden border-2 cursor-pointer
                        ${template.selected ? 'border-[#00F0FF]' : 'border-transparent'}
                      `}
                      onClick={() => handleTemplateSelection(template.id)}
                    >
                      <div className="p-4 bg-white/5">
                        <h3 className="font-medium mb-2">Template {index + 1}</h3>
                        <p className="text-sm text-gray-400 mb-4">Subject: {template.subject}</p>
                        <div className="relative h-40 overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(template.html);
                            }}
                            className="absolute top-2 right-2 p-2 bg-[#00F0FF]/20 rounded-full hover:bg-[#00F0FF]/30 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <iframe
                            srcDoc={template.html}
                            className="w-full h-full border-0"
                            title={`Template ${index + 1}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Template {index + 1}</span>
                      {template.selected && (
                        <Check className="w-5 h-5 text-[#00F0FF]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {previewHtml && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                  <div className="bg-[#0D0D1F] rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-[#00F0FF]/20">
                      <h3 className="font-semibold">Template Preview</h3>
                      <button
                        onClick={() => setPreviewHtml(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                      <iframe
                        ref={previewRef}
                        className="w-full h-full bg-white rounded"
                        title="Email Preview"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-lg border border-[#00F0FF]/20 hover:bg-[#00F0FF]/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={templates.filter(t => t.selected).length !== 2}
                  className={`
                    px-6 py-3 rounded-lg font-semibold
                    ${templates.filter(t => t.selected).length === 2
                      ? 'bg-gradient-to-r from-[#00F0FF] to-[#A742FF] hover:opacity-90'
                      : 'bg-gray-700 cursor-not-allowed'
                    }
                  `}
                >
                  Set Up Experiment
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white/5 rounded-lg p-6 border border-[#00F0FF]/20">
              <h2 className="text-2xl font-semibold mb-6">Experiment Setup</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Test Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={experimentSetup.testDuration}
                    onChange={(e) => setExperimentSetup(prev => ({
                      ...prev,
                      testDuration: parseInt(e.target.value)
                    }))}
                    className="w-full bg-white/5 border border-[#00F0FF]/20 rounded-lg p-3 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Audience Size</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={experimentSetup.audienceSize}
                    onChange={(e) => setExperimentSetup(prev => ({
                      ...prev,
                      audienceSize: parseInt(e.target.value)
                    }))}
                    className="w-full bg-white/5 border border-[#00F0FF]/20 rounded-lg p-3 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={experimentSetup.startDate}
                    onChange={(e) => setExperimentSetup(prev => ({
                      ...prev,
                      startDate: e.target.value
                    }))}
                    className="w-full bg-white/5 border border-[#00F0FF]/20 rounded-lg p-3 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-lg border border-[#00F0FF]/20 hover:bg-[#00F0FF]/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={saveExperiment}
                  className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#00F0FF] to-[#A742FF] hover:opacity-90"
                >
                  Start Experiment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}