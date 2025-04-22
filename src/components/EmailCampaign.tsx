import React from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../lib/store';
import { EmailEditor, EditorRef } from 'react-email-editor';
import { Toaster } from 'react-hot-toast';

export function EmailCampaign() {
  const router = useRouter();
  const { user } = useAuthStore();
  const emailEditorRef = React.useRef<EditorRef>(null);

  const onLoad = () => {
    // 编辑器加载完成后的回调
    console.log('Email editor loaded');
  };

  const onReady = () => {
    // 编辑器准备就绪后的回调
    console.log('Email editor ready');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white">
      <Toaster position="top-right" />
      
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="text-2xl font-bold text-[#00F0FF]"
              >
                AI Nurture
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-white/80">{user?.email}</span>
              <button
                onClick={() => router.push('/')}
                className="text-white/80 hover:text-[#00F0FF] transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="pt-16 h-[calc(100vh-4rem)]">
        <EmailEditor
          ref={emailEditorRef}
          onLoad={onLoad}
          onReady={onReady}
          options={{
            customCSS: [`
              .builder-sidebar {
                background-color: #1A1A1A !important;
                color: white !important;
              }
              .builder-sidebar-item {
                color: white !important;
              }
              .builder-sidebar-item:hover {
                background-color: #2A2A2A !important;
              }
            `],
          }}
        />
      </main>
    </div>
  );
} 