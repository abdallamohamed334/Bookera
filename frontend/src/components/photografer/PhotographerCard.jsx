import { motion } from "framer-motion";
import ShareButton from "./ShareButton";

const PhotographerCard = ({ photographer, onPhotographerClick, renderStars }) => {
  const handleCardClick = () => {
    onPhotographerClick(photographer);
  };

  const handleShare = (e) => {
    e.stopPropagation(); // منع فتح صفحة المصور عند المشاركة
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-blue-300 hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="relative h-48 flex-shrink-0">
        <img 
          src={photographer.profileImage} 
          alt={photographer.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400";
          }}
        />
        
        {/* السعر وزر المشاركة في نفس السطر */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {parseInt(photographer.price)?.toLocaleString() || photographer.price} جنيه
          </div>
          
          {/* زر المشاركة */}
          <ShareButton 
            photographer={photographer}
            onShare={handleShare}
          />
        </div>
        
        <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-xs">
          {photographer.city}
        </div>
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded">
          {renderStars(photographer.rating)}
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-bold text-gray-900">{photographer.name}</h4>
          <span className="text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded">
            {photographer.experience} سنة
          </span>
        </div>
        <p className="text-blue-600 font-medium mb-2">{photographer.specialty}</p>
        <p className="text-gray-600 text-sm mb-3">{photographer.city}، {photographer.governorate}</p>
        <div className="flex flex-wrap gap-1 mb-4 flex-grow">
          {photographer.services?.slice(0, 3).map((service, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
            >
              {service}
            </span>
          ))}
          {photographer.services?.length > 3 && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              +{photographer.services.length - 3} أكتر
            </span>
          )}
        </div>
        <div className="mt-auto flex gap-2">
          <button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors"
          >
            شوف التفاصيل
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotographerCard;