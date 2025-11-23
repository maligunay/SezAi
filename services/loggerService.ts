import { Message, Role, ChatLog } from '../types';

/**
 * LOGGER SERVICE (PostgreSQL Integration Layer)
 * 
 * Bu servis, konuşma verilerini PostgreSQL veritabanına kaydedilmeye hazır hale getirir.
 * GÜVENLİK UYARISI: Frontend uygulamasında doğrudan DB şifresi saklanmaz.
 * Bu servis veriyi hazırlar ve sizin sunucunuzdaki bir API endpoint'ine (Örn: /api/save-chat) gönderir.
 */

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

export const logMessageToPostgres = async (sessionId: string, message: Message): Promise<void> => {
  // 1. Veritabanı Şemasına Uygun Veri Hazırlama
  const logEntry: Partial<ChatLog> = {
    sessionId: sessionId,
    userAgent: navigator.userAgent,
    conversation: [{
      role: message.role,
      content: message.text,
      timestamp: message.timestamp.toISOString()
    }],
    metadata: {
      deviceType: getDeviceType(),
      platform: navigator.platform
    }
  };

  // 2. Konsola Yazdırma (Test Amaçlı)
  if (process.env.NODE_ENV === 'development') {
    console.log("[PostgreSQL Logger] Backend'e gönderilecek paket:", logEntry);
  }

  // 3. API Çağrısı (Backend Entegrasyonu)
  // csb.gov.tr sunucularında çalışan backend servisine istek atılır.
  try {
    /* 
    NOT: Bu kısım backend API'niz hazır olduğunda aktif edilmelidir.
    
    const response = await fetch('https://api.csb.gov.tr/v1/chat/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer <TOKEN>' // Gerekirse token eklenir
      },
      body: JSON.stringify(logEntry)
    });

    if (!response.ok) {
      console.error('Loglama hatası:', response.statusText);
    }
    */
    
    // Geçici olarak LocalStorage kullanıyoruz (Demo için)
    const existingLogs = localStorage.getItem('csb_chat_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(logEntry);
    localStorage.setItem('csb_chat_logs', JSON.stringify(logs));

  } catch (error) {
    console.error("Veritabanı loglama hatası:", error);
  }
};

export const generateSessionId = (): string => {
  // Benzersiz bir oturum ID'si oluşturur
  return 'csb_sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};