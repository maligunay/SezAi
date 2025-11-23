import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} T.C. Çevre, Şehircilik ve İklim Değişikliği Bakanlığı. Tüm hakları saklıdır.
        </p>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:text-csb-blue">Gizlilik Politikası</span>
          <span className="cursor-pointer hover:text-csb-blue">Kullanım Koşulları</span>
          <span className="cursor-pointer hover:text-csb-blue">KVKK Aydınlatma Metni</span>
        </div>
      </div>
    </footer>
  );
};