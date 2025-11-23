import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  close: () => void;
  openAdmin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, close, openAdmin }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity lg:hidden"
          onClick={close}
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:hidden'
        }`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-bold text-gray-800">Menü</h2>
            <button onClick={close} className="text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              {[
                { name: 'Bakanlık Ana Sayfa', url: 'https://csb.gov.tr' },
                { name: 'e-Devlet Hizmetleri', url: 'https://www.turkiye.gov.tr/cevre-ve-sehircilik-bakanligi' },
                { name: 'Hasar Tespit', url: 'https://hasartespit.csb.gov.tr' },
                { name: 'Kentsel Dönüşüm', url: 'https://kentseldonusum.csb.gov.tr' },
                { name: 'İklim Değişikliği', url: 'https://iklim.csb.gov.tr' },
                { name: 'MeteoUyarı', url: 'https://mgm.gov.tr/meteouyari' },
              ].map((link) => (
                <li key={link.url}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-50 hover:text-csb-blue transition-colors group"
                  >
                    <svg className="h-4 w-4 mr-3 text-gray-400 group-hover:text-csb-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-sm font-bold text-csb-blue mb-2">Acil Durum?</h4>
              <p className="text-xs text-gray-600 mb-3">Çevre şikayetleri ve acil durumlar için 7/24 hattımızı arayabilirsiniz.</p>
              
              {/* Mobile Call Button */}
              <a href="tel:181" className="lg:hidden block w-full text-center py-2 bg-csb-blue text-white text-sm font-bold rounded shadow hover:bg-blue-700 transition">
                Alo 181'i Ara
              </a>

              {/* Desktop Web Link Button */}
              <a href="https://181.csb.gov.tr/" target="_blank" rel="noreferrer" className="hidden lg:block w-full text-center py-2 bg-csb-blue text-white text-sm font-bold rounded shadow hover:bg-blue-700 transition">
                Alo 181 Web Sitesi
              </a>
            </div>
          </div>
          
          <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col gap-2">
             <button 
               onClick={openAdmin}
               className="flex items-center text-[11px] text-gray-500 hover:text-csb-blue transition-colors"
             >
               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               Yönetici Girişi (Veri Yükle)
             </button>
             <p className="text-[10px] text-gray-400 text-center">
               T.C. Çevre, Şehircilik ve İklim Değişikliği Bakanlığı
             </p>
          </div>
        </div>
      </aside>
    </>
  );
};