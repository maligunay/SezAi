import React from 'react';
import { Message, Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

// Simple link parser helper
const renderTextWithLinks = (text: string) => {
  // Regex to find Markdown style links [text](url)
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  // Regex to find raw URLs if not markdown
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  // First pass: Markdown links
  // We will do a simplified split. In a robust app, use a proper Markdown parser.
  // This is a manual simple parser for safety without external dependencies.
  
  const segments = text.split('\n');
  
  return segments.map((segment, i) => (
    <p key={i} className={`mb-1 last:mb-0 ${segment.startsWith('-') || segment.startsWith('*') ? 'pl-4' : ''}`}>
        {parseSegment(segment)}
    </p>
  ));
};

const parseSegment = (text: string) => {
    // Basic bold **text** parsing
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        // Link parsing inside text
        return <span key={index} dangerouslySetInnerHTML={{ __html: linkify(part) }} />;
    });
}

const linkify = (inputText: string) => {
    let replacedText;

    // Replace Markdown links [text](url)
    const mdLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    replacedText = inputText.replace(mdLinkPattern, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-csb-blue underline hover:text-blue-800 font-medium">$1</a>');

    // Replace raw URLs if not already part of an anchor tag (simplified check)
    if (!replacedText.includes('<a ')) {
         const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
         replacedText = replacedText.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-csb-blue underline hover:text-blue-800 font-medium">$1</a>');
    }
    
    return replacedText;
}


export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm mx-2 mt-1 overflow-hidden ${isUser ? 'bg-gray-200' : 'bg-white border border-gray-100 p-1'}`}>
          {isUser ? (
             <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
          ) : (
             <img 
                src="/sezai-logo.png" 
                alt="SezAi" 
                className="h-full w-full object-contain" 
                onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/1786/1786548.png';
                }}
             />
          )}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
              isUser 
                ? 'bg-csb-blue text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              <div className="prose prose-sm max-w-none text-inherit">
                 {isUser ? message.text : renderTextWithLinks(message.text)}
              </div>
            </div>

            {/* Sources / Citations for Bot */}
            {!isUser && message.sources && message.sources.length > 0 && (
              <div className="mt-2 ml-1 p-2 bg-blue-50 rounded-lg border border-blue-100 max-w-full">
                <p className="text-xs font-semibold text-csb-blue mb-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                  Kaynaklar:
                </p>
                <div className="flex flex-wrap gap-2">
                  {message.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[11px] bg-white text-gray-600 px-2 py-1 rounded border border-gray-200 hover:text-csb-blue hover:border-csb-blue transition truncate max-w-[200px]"
                    >
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            <span className="text-[10px] text-gray-400 mt-1 mx-1">
              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
        </div>
      </div>
    </div>
  );
};