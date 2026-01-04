import { useState } from "react";

const ShareButton = ({ photographer, onShare }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareUrl = `${window.location.origin}/photographer/${photographer._id}`;
  const shareText = `شوف مصور ${photographer.name} المتخصص في ${photographer.specialty} على موقعنا!`;

  const handleShare = async (platform) => {
    onShare();
    
    const shareData = {
      title: `مصور ${photographer.name}`,
      text: shareText,
      url: shareUrl,
    };

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('تم نسخ الرابط!');
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
        break;
      default:
        break;
    }
    
    setShowShareOptions(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowShareOptions(!showShareOptions);
        }}
        className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-md transition-all hover:scale-110"
        title="مشاركة المصور"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
      </button>

      {showShareOptions && (
        <div className="absolute left-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-48">
          <div className="space-y-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
            >
              <span className="text-green-500">📱</span>
              <span>واتساب</span>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
            >
              <span className="text-blue-500">🔵</span>
              <span>فيسبوك</span>
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-400 rounded-md transition-colors"
            >
              <span className="text-blue-400">🐦</span>
              <span>تويتر</span>
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 rounded-md transition-colors"
            >
              <span className="text-blue-500">✈️</span>
              <span>تيليجرام</span>
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
            >
              <span>📋</span>
              <span>نسخ الرابط</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;