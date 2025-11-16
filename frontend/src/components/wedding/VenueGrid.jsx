import { motion } from "framer-motion";
import VenueCard from "./VenueCard";

const VenueGrid = ({
  loading,
  filteredVenues,
  dataSource,
  totalVenues,
  onVenueClick,
  onBookNow,
  onResetFilters
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (filteredVenues.length === 0) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <div className="lg:w-3/4 p-6">
      <GridHeader 
        filteredCount={filteredVenues.length}
        dataSource={dataSource}
        totalVenues={totalVenues}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <VenueCard
            key={venue._id || venue.id}
            venue={venue}
            onVenueClick={onVenueClick}
            onBookNow={onBookNow}
          />
        ))}
      </div>
    </div>
  );
};

const GridHeader = ({ filteredCount, dataSource, totalVenues }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <div>
      <h3 className="text-2xl font-bold text-gray-900">
        قاعات الأفراح المتاحة ({filteredCount})
      </h3>
      <p className="text-gray-600 mt-1">
        {dataSource === "api" 
          ? `بيانات حقيقية من قاعدة البيانات - ${totalVenues} قاعة` 
          : "جاري تحميل البيانات..."}
      </p>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
    <p className="text-gray-600">جاري تحميل القاعات من قاعدة البيانات...</p>
  </div>
);

const EmptyState = ({ onResetFilters }) => (
  <div className="text-center py-12">
    <div className="text-5xl mb-4">🔍</div>
    <h3 className="text-xl font-bold text-gray-700 mb-2">مفيش نتايج</h3>
    <p className="text-gray-600">جرب تغيير الفلاتر عشان تظهرلك نتايج أكتر</p>
    <button 
      onClick={onResetFilters}
      className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
    >
      مسح الفلاتر
    </button>
  </div>
);

export default VenueGrid;