import React, { useState, useEffect, useRef } from 'react';
import { Message, Role, UploadedFile } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { logMessageToPostgres, generateSessionId } from '../services/loggerService';
import { MessageBubble } from './MessageBubble';

interface ChatInterfaceProps {
  knowledgeBase?: UploadedFile[];
}

const MAX_CHARS = 500; // Limit 500 karaktere çekildi
const MAX_MESSAGES_PER_SESSION = 15; // Oturum başına maksimum mesaj sayısı

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ knowledgeBase = [] }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Kullanıcının kaç mesaj attığını hesapla
  const userMessageCount = messages.filter(m => m.role === Role.USER).length;
  const isSessionFinished = userMessageCount >= MAX_MESSAGES_PER_SESSION;

  // Initial greeting
  useEffect(() => {
    const greeting: Message = {
      id: 'init-1',
      role: Role.MODEL,
      text: "Merhaba! Ben Yapay Zeka Asistanı Bilgiç. Bakanlık hizmetleri, mevzuat veya yüklediğiniz dokümanlarla ilgili sorularınızı cevaplayabilirim. Nasıl yardımcı olabilirim?",
      timestamp: new Date()
    };
    setMessages([greeting]);
    logMessageToPostgres(sessionId, greeting);
  }, [sessionId]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setInput(text);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isSessionFinished) return;

    // Security: Input Sanitization (Double check)
    const sanitizedInput = input.trim().slice(0, MAX_CHARS);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: sanitizedInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    logMessageToPostgres(sessionId, userMessage);

    try {
      // Pass knowledgeBase to the service
      const response = await sendMessageToGemini(messages, sanitizedInput, knowledgeBase);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: response.text,
        timestamp: new Date(),
        sources: response.sources
      };

      setMessages(prev => [...prev, botMessage]);
      logMessageToPostgres(sessionId, botMessage);

    } catch (error) {
       console.error("Chat Error", error);
       const errorMsg: Message = {
           id: Date.now().toString(),
           role: Role.MODEL,
           text: "Üzgünüm, bir bağlantı hatası oluştu. Lütfen tekrar deneyiniz.",
           timestamp: new Date(),
           isError: true
       };
       setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-xl rounded-none md:rounded-lg overflow-hidden border-x border-gray-200">
      
      {/* Knowledge Base Indicator (if files are loaded) */}
      {knowledgeBase.length > 0 && (
        <div className="bg-blue-50 px-4 py-2 text-xs text-csb-blue border-b border-blue-100 flex items-center justify-between">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Aktif Bilgi Bankası: <b>{knowledgeBase.length} Doküman</b>
          </span>
          <span className="text-[10px] text-blue-400">Bilgiç cevaplarken bunları kullanacak</span>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-slate-50">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
           <div className="flex w-full mb-6 justify-start">
              <div className="flex flex-row items-start max-w-[80%]">
                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-csb-red flex items-center justify-center shadow-sm mx-2 mt-1">
                    <span className="text-white text-[10px] font-bold">CSB</span>
                 </div>
                 <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                    </div>
                 </div>
              </div>
           </div>
        )}
        
        {/* Session Limit Warning inside chat flow */}
        {isSessionFinished && (
            <div className="flex justify-center my-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center shadow-sm">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Günlük soru limitine (15 adet) ulaştınız. Yeni bir sohbet için lütfen sayfayı yenileyiniz.</span>
                </div>
            </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto relative flex flex-col gap-1">
          <div className="relative flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={isSessionFinished}
                  placeholder={isSessionFinished ? "Oturum sonlandı." : (knowledgeBase.length > 0 ? "Dokümanlar veya bakanlık hizmetleri hakkında sorun..." : "Bakanlık hizmetleri hakkında bir soru sorun...")}
                  className={`w-full pl-4 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-csb-blue focus:border-csb-blue resize-none shadow-sm transition-all max-h-32 ${
                      isSessionFinished 
                      ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-50 border-gray-300 text-gray-700 placeholder-gray-400 focus:bg-white'
                  }`}
                  rows={1}
                  style={{ minHeight: '48px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isSessionFinished}
              className={`flex items-center justify-center h-12 w-12 rounded-full shadow-md transition-all duration-200 ${
                !input.trim() || isLoading || isSessionFinished
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-csb-red text-white hover:bg-red-700 hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          {/* Character Counter */}
          <div className="flex justify-between px-2">
            <span className="text-[10px] text-gray-400">Bilgiç hatalı bilgi verebilir. Resmi kaynakları teyit ediniz.</span>
            <span className={`text-[10px] font-medium ${input.length >= MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
              {isSessionFinished ? `15/15 Mesaj` : `${input.length}/${MAX_CHARS}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};