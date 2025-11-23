import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/Header';
import { Disclaimer } from './components/Disclaimer';
import { Sidebar } from './components/Sidebar';
import { AdminPanel } from './components/AdminPanel';
import { UploadedFile } from './types';

const STORAGE_KEY = 'bilgic_knowledge_base_v1';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // State başlatılırken önce LocalStorage kontrol ediliyor (Persistent Memory)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    try {
      const savedFiles = localStorage.getItem(STORAGE_KEY);
      return savedFiles ? JSON.parse(savedFiles) : [];
    } catch (error) {
      console.error("Hafıza okuma hatası:", error);
      return [];
    }
  });

  // Dosya listesi her değiştiğinde LocalStorage güncelleniyor
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedFiles));
    } catch (error) {
      console.error("Depolama alanı hatası:", error);
      alert("Tarayıcı hafızası doldu! Son yüklediğiniz dosya kaydedilememiş olabilir. Lütfen gereksiz dosyaları silin.");
    }
  }, [uploadedFiles]);

  return (
    <div className="flex h-screen flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          close={() => setIsSidebarOpen(false)}
          openAdmin={() => {
            setIsSidebarOpen(false); // Close sidebar on mobile when admin opens
            setIsAdminOpen(true);
          }}
        />

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col items-center justify-center w-full relative z-0">
          <div className="w-full h-full max-w-5xl flex flex-col">
            <ChatInterface knowledgeBase={uploadedFiles} />
          </div>
        </main>
      </div>

      {/* Footer / Disclaimer */}
      <Disclaimer />

      {/* Admin Panel Modal */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        files={uploadedFiles}
        onFilesChange={setUploadedFiles}
      />
    </div>
  );
}