import { motion } from "framer-motion";
import PhotographerCard from "./PhotographerCard";

const PhotographersGrid = ({
  photographers,
  loading,
  dataSource,
  totalCount,
  onPhotographerClick,
  onResetFilters
}) => {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-gray-600 text-sm mr-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحميل المصورين من قاعدة البيانات...</p>
      </div>
    );
  }

  if (photographers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">مفيش نتايج</h3>
        <p className="text-gray-600">جرب تغيير الفلاتر عشان تظهرلك نتايج أكتر</p>
        <button 
          onClick={onResetFilters}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          مسح الفلاتر
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-full">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              المصورين المتاحين ({photographers.length})
            </h3>
            <p className="text-gray-600 mt-1">
              {dataSource === "api" 
                ? `بيانات حقيقية من قاعدة البيانات - ${totalCount} مصور` 
                : dataSource === "mock"
                ? `بيانات تجريبية للعرض - ${totalCount} مصور`
                : "جاري تحميل البيانات..."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {photographers.map((photographer) => (
            <PhotographerCard
              key={photographer._id || photographer.id}
              photographer={photographer}
              onPhotographerClick={onPhotographerClick}
              renderStars={renderStars}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotographersGrid;