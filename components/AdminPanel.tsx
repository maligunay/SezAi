import React, { useState, useRef } from 'react';
import { UploadedFile } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, files, onFilesChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogin = () => {
    // Demo password
    if (password === 'csb123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Hatalı şifre.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Basic validation
      if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
        alert(`${file.name} desteklenmiyor. Lütfen PDF veya TXT yükleyin.\nWord dosyaları için lütfen PDF olarak dışa aktarınız.`);
        continue;
      }

      // Dosya boyutu kontrolü (LocalStorage limiti için basit önlem - 2MB)
      if (file.size > 2 * 1024 * 1024) {
         alert(`${file.name} çok büyük. Lütfen 2MB altındaki dosyaları yükleyin veya metni parçalara bölün.`);
         continue;
      }

      // Read file as Base64
      const reader = new FileReader();
      const promise = new Promise<void>((resolve) => {
        reader.onload = (e) => {
          const base64String = (e.target?.result as string).split(',')[1];
          newFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            data: base64String
          });
          resolve();
        };
      });
      reader.readAsDataURL(file);
      await promise;
    }

    onFilesChange([...files, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    if(window.confirm("Bu dokümanı kalıcı hafızadan silmek istediğinize emin misiniz?")) {
        onFilesChange(files.filter(f => f.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-csb-blue px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Yönetici Paneli - Bilgiç Hafıza Yönetimi</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Lütfen yönetici şifresini giriniz (Demo: csb123)</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-csb-blue focus:border-csb-blue outline-none"
                placeholder="Şifre"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button 
                onClick={handleLogin}
                className="w-full bg-csb-red text-white font-bold py-2 rounded-md hover:bg-red-700 transition"
              >
                Giriş Yap
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Bilgi Bankasına Veri Ekle</h4>
                <p className="text-xs text-gray-500 mb-3">
                  Bilgiç'in soruları cevaplarken kullanması için PDF veya TXT dosyaları yükleyin. Bu dosyalar kalıcı olarak saklanır.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    multiple
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 text-sm font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Dosya Seç
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Kalıcı Dosyalar ({files.length})</h4>
                {files.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Henüz dosya yüklenmedi.</p>
                ) : (
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {files.map((file) => (
                      <li key={file.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                        <span className="truncate max-w-[250px] text-gray-700 flex items-center">
                          {file.type === 'application/pdf' ? (
                            <span className="w-8 h-5 bg-red-100 text-red-600 text-[10px] font-bold flex items-center justify-center rounded mr-2">PDF</span>
                          ) : (
                            <span className="w-8 h-5 bg-gray-200 text-gray-600 text-[10px] font-bold flex items-center justify-center rounded mr-2">TXT</span>
                          )}
                          {file.name}
                        </span>
                        <button 
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Kalıcı olarak sil"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="bg-green-50 p-3 rounded text-xs text-green-800 border border-green-200 flex items-start">
                 <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <span>
                    <strong>Güvenli Depolama:</strong> Yüklediğiniz dosyalar tarayıcınızın güvenli hafızasına kaydedildi. 
                    Sayfayı yenileseniz veya bilgisayarı kapatsanız bile <u>siz silene kadar</u> burada kalacaklar.
                 </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};