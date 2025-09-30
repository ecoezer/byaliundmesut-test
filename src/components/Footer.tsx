import React, { useState } from 'react';
import { MapPin, Phone, Heart } from 'lucide-react';

const Footer = () => {
  const [copied, setCopied] = useState(false);
  const phoneNumber = '+4915771459166';
  const displayNumber = '01577 1459166';

  const handleWhatsApp = async (e: React.MouseEvent) => {
    e.preventDefault();

    const whatsappURL = `https://wa.me/${phoneNumber}`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail: clipboard might not be supported/allowed
    }

    try {
      if (isMobile) {
        const win = window.open(whatsappURL, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') window.location.href = whatsappURL;
      } else {
        window.open(whatsappURL, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.location.href = whatsappURL;
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-orange-50 border-t-2 border-orange-400 py-4">
      <div className="container mx-auto px-4 max-w-lg text-center space-y-3">
        {/* Address */}
        <div className="bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors">
          <div className="flex justify-center mb-1">
            <div className="p-1.5 bg-orange-100 rounded-full">
              <MapPin className="h-3.5 w-3.5 text-orange-600" />
            </div>
          </div>
          <div className="font-bold text-gray-800 text-sm">🏠 FRANKFURTER STR. 7</div>
          <div className="text-xs text-gray-600">📮 38729 LUTTER AM BARENBERGE</div>
          <p className="text-xs text-gray-500">🚗 by Ali und Mesut Lieferservice</p>
        </div>

        {/* WhatsApp Button */}
        <div className="relative">
          <a
            href={`https://wa.me/${phoneNumber}`}
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl p-3 shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="p-1.5 bg-white/20 rounded-full">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-medium">💬 WhatsApp & Anrufen</div>
              <div className="font-bold">{displayNumber}</div>
            </div>
          </a>
          {copied && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-xs select-none">
              ✅ Kopyalandı!
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <Heart className="h-3.5 w-3.5 text-orange-400" />
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Footer Text */}
        <div className="space-y-0.5">
          <div className="font-medium text-gray-700 text-sm">
            🍽️ Leckere Döner, Pizza & mehr in Lutter am Barenberge
          </div>
          <p className="text-xs text-gray-500">
            © 2025 by Ali und Mesut 🚕 - Alle Rechte vorbehalten
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
