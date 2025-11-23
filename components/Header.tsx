import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-20 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Emblem and Titles */}
            <div className="flex items-center gap-3">
              {/* Bilgiç Custom Logo */}
              <div className="relative h-16 w-16 flex-shrink-0 -ml-2">
                 <img 
                    src="/sezai-logo.png" 
                    alt="Bilgiç Robot" 
                    className="h-full w-full object-contain drop-shadow-md"
                    onError={(e) => {
                        // Fallback: Eco-Friendly Robot Icon if local file is missing
                        (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/1786/1786548.png';
                    }}
                 />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-500 tracking-wider">T.C. ÇEVRE, ŞEHİRCİLİK VE</span>
                <span className="text-xs sm:text-xs font-semibold text-gray-500 tracking-wider">İKLİM DEĞİŞİKLİĞİ BAKANLIĞI</span>
                <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-sm sm:text-base font-extrabold text-csb-blue tracking-tight">
                    Bilgiç <span className="text-csb-red"> </span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-bold border border-green-200 shadow-sm">Yapay Zeka Asistanı</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
             <a 
               href="https://csb.gov.tr" 
               target="_blank" 
               rel="noreferrer"
               className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-csb-blue hover:bg-blue-700 transition-colors"
             >
               csb.gov.tr
             </a>
             
             {/* Alo 181 - Desktop Version (Web Link) */}
             <a 
               href="https://181.csb.gov.tr/" 
               target="_blank"
               rel="noreferrer"
               className="hidden sm:inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-csb-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
               Alo 181 Web
             </a>

             {/* Alo 181 - Mobile Version (Call Link) */}
             <a 
               href="tel:181" 
               className="sm:hidden inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-csb-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
               <span className="ml-1">181</span>
             </a>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-csb-red via-white to-csb-blue"></div>
    </header>
  );
};