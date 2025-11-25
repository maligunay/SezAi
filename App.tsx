import React, { useState, useEffect, useRef } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/Header';
import { Disclaimer } from './components/Disclaimer';
import { Sidebar } from './components/Sidebar';
import { AdminPanel } from './components/AdminPanel';
import { UploadedFile } from './types';

const STORAGE_KEY = 'bilgic_knowledge_base_v1';

// --- LOKAL DOSYA AYARLARI ---
// Proje klasörünüzde "public/belgeler" diye bir klasör açın.
// Oraya attığınız dosyaların tam isimlerini buraya yazın.
// Uygulama açılınca bunları otomatik okuyacaktır.
const LOCAL_FILES_TO_LOAD = [
  // Örnek: 'mevzuat.pdf', 'genelge.txt'
  // 'kentsel_donusum_kanunu.pdf', 
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  
  // 1. LocalStorage'dan (Tarayıcı Hafızası) Gelen Dosyalar
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    try {
      const savedFiles = localStorage.getItem(STORAGE_KEY);
      return savedFiles ? JSON.parse(savedFiles) : [];
    } catch (error) {
      console.error("Hafıza okuma hatası:", error);
      return [];
    }
  });

  // 2. Proje Klasöründen Otomatik Yüklenen Dosyalar
  const [localFiles, setLocalFiles] = useState<UploadedFile[]>([]);
  const loadedRef = useRef(false);

  // Proje klasöründeki dosyaları çekme fonksiyonu
  useEffect(() => {
    const fetchLocalFiles = async () => {
      if (loadedRef.current || LOCAL_FILES_TO_LOAD.length === 0) return;
      loadedRef.current = true;
      setIsLocalLoading(true);

      const loadedDocs: UploadedFile[] = [];

      console.log("Lokal belgeler yükleniyor...");

      for (const fileName of LOCAL_FILES_TO_LOAD) {
        try {
          // Dosyaları /belgeler klasöründen çek
          const response = await fetch(`/belgeler/${fileName}`);
          if (!response.ok) throw new Error(`Dosya bulunamadı: ${fileName}`);

          const blob = await response.blob();
          
          // Blob -> Base64 dönüşümü
          const base64Data = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result as string;
              resolve(res.split(',')[1]); // "data:application/pdf;base64," kısmını at
            };
            reader.readAsDataURL(blob);
          });

          loadedDocs.push({
            id: `local-${fileName}`,
            name: fileName + ' (Sistem)',
            type: fileName.endsWith('.pdf') ? 'application/pdf' : 'text/plain',
            data: base64Data
          });
          
          console.log(`Yüklendi: ${fileName}`);

        } catch (error) {
          console.error(`Otomatik yükleme hatası (${fileName}):`, error);
        }
      }

      setLocalFiles(loadedDocs);
      setIsLocalLoading(false);
    };

    fetchLocalFiles();
  }, []);

  // Dosya listesi her değiştiğinde LocalStorage güncelleniyor (Sadece manuel yüklenenler)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedFiles));
    } catch (error) {
      console.error("Depolama alanı hatası:", error);
    }
  }, [uploadedFiles]);

  // Tüm dosyaların birleşimi (Manuel + Otomatik)
  const allKnowledgeBase = [...uploadedFiles, ...localFiles];

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
            <ChatInterface knowledgeBase={allKnowledgeBase} />
            
            {/* Lokal Yükleme Göstergesi (Opsiyonel) */}
            {isLocalLoading && (
              <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded shadow z-50">
                Sistem dosyaları yükleniyor...
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer / Disclaimer */}
      <Disclaimer />

      {/* Admin Panel Modal */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        files={uploadedFiles} // Admin panelinde sadece manuel yüklenenler yönetilir
        onFilesChange={setUploadedFiles}
      />
    </div>
  );
}