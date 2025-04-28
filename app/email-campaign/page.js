"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import EmailEditor from "react-email-editor";
import { toPng } from "html-to-image";
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
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../lib/store";
import { Footer } from "../components/Footer";
import { generateEmailTemplate } from "../lib/claude";
import toast from "react-hot-toast";

export default function EmailCampaign() {
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [requirement, setRequirement] = useState("");
  const [templates, setTemplates] = useState([]);
  const [uploadedTemplate, setUploadedTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [experimentSetup, setExperimentSetup] = useState({
    testDuration: 7,
    audienceSize: 1000,
    startDate: new Date().toISOString().split("T")[0],
  });

  const emailEditorRef = useRef(null);
  const previewRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/html": [".html"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedTemplate(reader.result);
      };
      reader.readAsText(file);
    },
  });

  const parseRequirement = (input) => {
    console.log(input);
  };

  const generateTemplates = async () => {
    try {
      console.log("Starting template generation...");

      if (!requirement) {
        toast.error("Please enter a requirement");
        return;
      }

      setIsGenerating(true);
      setCountdown(30);

      // 开始倒计时
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const templates = [await generateEmailTemplate(requirement)];

      // 清除倒计时
      clearInterval(timer);
      setCountdown(0);

      console.log("Generated templates:", templates);

      // 处理生成的模板
      const processedTemplates = templates.map((template, index) => ({
        id: `template-${index + 1}`,
        html: template?.html || "",
        subject: template?.subject || `Template ${index + 1}`,
        thumbnail: `data:image/svg+xml,${encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f0f0f0"/></svg>'
        )}`,
        selected: false,
      }));

      setTemplates(processedTemplates);
      setStep(2);

      // 自动预览第一个模板
      if (processedTemplates.length > 0) {
        handlePreview(processedTemplates[0].html);
      }
    } catch (error) {
      console.error("Error in generateTemplates:", error);
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
      setCountdown(0);
    }
  };

  const handleTemplateSelection = (templateId) => {
    setTemplates((prev) =>
      prev.map((template) => ({
        ...template,
        selected:
          template.id === templateId ? !template.selected : template.selected,
      }))
    );
  };

  const handlePreview = (html) => {
    setPreviewHtml(html);

    // 更新预览iframe内容
    if (previewRef.current) {
      const doc = previewRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 0; }
                .email-container { max-width: 600px; margin: 0 auto; }
              </style>
            </head>
            <body>
              <div class="email-container">
                ${html}
              </div>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  };

  const saveExperiment = async () => {
    try {
      const selectedTemplates = templates.filter((t) => t.selected);
      if (selectedTemplates.length !== 2) {
        throw new Error("Please select exactly 2 templates for A/B testing");
      }

      // Mock save experiment
      console.log("Saving experiment:", {
        templates: selectedTemplates,
        setup: experimentSetup,
      });

      setStep(3);
    } catch (error) {
      console.error("Error saving experiment:", error);
      alert("Failed to save experiment. Please try again.");
    }
  };

  const steps = [
    { number: 1, title: "Requirement", icon: MessageSquare },
    { number: 2, title: "Generation", icon: Wand2 },
    { number: 3, title: "Experiment", icon: TestTube },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10 pointer-events-none" />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Hey{" "}
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent">
              {user?.displayName || "there"}
            </span>
            , let's create your email campaign
          </h1>
          <p className="text-gray-400">
            Describe your requirements and let AI do the magic
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.number}>
                <div
                  className={`flex items-center ${
                    step >= s.number ? "text-[#00F0FF]" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${step >= s.number ? "bg-[#00F0FF]/20" : "bg-gray-800"}
                  `}
                  >
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
            <div className="bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Campaign Requirements
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Describe your campaign
                  </label>
                  <textarea
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="Enter: audience, scenario, type, goal"
                    className="w-full px-4 py-2 bg-white/5 border border-[#00F0FF]/20 rounded-lg focus:outline-none focus:border-[#00F0FF] h-32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload template (optional)
                  </label>
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-[#00F0FF]/20 rounded-lg p-8 text-center cursor-pointer hover:border-[#00F0FF] transition-colors"
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 mx-auto mb-4 text-[#00F0FF]" />
                    <p className="text-gray-400">
                      Drag and drop an HTML template, or click to select
                    </p>
                  </div>
                </div>
                <button
                  onClick={generateTemplates}
                  disabled={isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      {countdown > 0 ? `生成中... ${countdown}秒` : "生成中..."}
                    </div>
                  ) : (
                    "Generate Templates"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold">Generated Templates</h2>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 rounded-lg border ${
                        template.selected
                          ? "border-[#00F0FF] bg-[#00F0FF]/5"
                          : "border-[#00F0FF]/20"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleTemplateSelection(template.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            template.selected
                              ? "border-[#00F0FF] bg-[#00F0FF]"
                              : "border-gray-400"
                          }`}
                        >
                          {template.selected && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {template.subject}
                          </h3>
                          <div className="aspect-video bg-gray-800 rounded-lg mb-4">
                            <img
                              src={template.thumbnail}
                              alt={template.subject}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePreview(template.html)}
                              className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePreview(template.html)}
                              className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={saveExperiment}
                  className="w-full py-4 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  Create A/B Test
                </button>
              </div>

              <div className="space-y-8">
                <h2 className="text-2xl font-semibold">Preview</h2>
                <div
                  className="bg-white rounded-lg overflow-hidden"
                  style={{ height: "1000px" }}
                >
                  <iframe
                    ref={previewRef}
                    className="w-full h-full"
                    title="Email Preview"
                    style={{ border: "none" }}
                  />
                </div>
                <div className="bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Experiment Setup
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Test Duration (days)
                      </label>
                      <input
                        type="number"
                        value={experimentSetup.testDuration}
                        onChange={(e) =>
                          setExperimentSetup((prev) => ({
                            ...prev,
                            testDuration: parseInt(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-[#00F0FF]/20 rounded-lg focus:outline-none focus:border-[#00F0FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Audience Size
                      </label>
                      <input
                        type="number"
                        value={experimentSetup.audienceSize}
                        onChange={(e) =>
                          setExperimentSetup((prev) => ({
                            ...prev,
                            audienceSize: parseInt(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-[#00F0FF]/20 rounded-lg focus:outline-none focus:border-[#00F0FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={experimentSetup.startDate}
                        onChange={(e) =>
                          setExperimentSetup((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-[#00F0FF]/20 rounded-lg focus:outline-none focus:border-[#00F0FF]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20 rounded-lg p-8">
              <Check className="w-16 h-16 text-[#00F0FF] mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-4">
                Experiment Created Successfully!
              </h2>
              <p className="text-gray-400 mb-8">
                Your A/B test has been set up and will start on{" "}
                {experimentSetup.startDate}. We'll notify you when the results
                are ready.
              </p>
              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Create Another Campaign
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
