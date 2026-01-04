// pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Settings, 
  BarChart3, 
  Building,
  Camera,
  Palette,
  LogOut,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Plus,
  User
} from 'lucide-react';

// أنواع البيانات
interface Booking {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  venue: {
    name: string;
    type: string;
  };
  eventDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

interface Venue {
  _id: string;
  name: string;
  type: 'wedding' | 'conference' | 'birthday' | 'other';
  capacity: number;
  price: number;
  location: string;
  description: string;
  images: string[];
  amenities: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Photographer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string[];
  portfolio: string[];
  price: number;
  rating: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [showAddPhotographer, setShowAddPhotographer] = useState(false);

  // حالة النموذج لإضافة قاعة
  const [newVenue, setNewVenue] = useState({
    name: '',
    type: 'wedding' as 'wedding' | 'conference' | 'birthday' | 'other',
    capacity: 0,
    price: 0,
    location: '',
    description: '',
    amenities: ['']
  });

  // حالة النموذج لإضافة مصور
  const [newPhotographer, setNewPhotographer] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: [''],
    price: 0,
    portfolio: ['']
  });

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, [user, navigate, isAdmin]);

  // بيانات وهمية علشان الاختبار
  const mockBookings: Booking[] = [
    {
      _id: '1',
      user: { name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567' },
      venue: { name: 'قاعة الأفراح الكبرى', type: 'wedding' },
      eventDate: '2024-12-01',
      guests: 200,
      totalPrice: 5000,
      status: 'pending',
      createdAt: '2024-10-28T10:00:00Z'
    },
    {
      _id: '2',
      user: { name: 'فاطمة علي', email: 'fatima@example.com', phone: '0507654321' },
      venue: { name: 'قاعة المؤتمرات الدولية', type: 'conference' },
      eventDate: '2024-12-15',
      guests: 150,
      totalPrice: 3000,
      status: 'confirmed',
      createdAt: '2024-10-29T14:30:00Z'
    },
    {
      _id: '3',
      user: { name: 'خالد السعدي', email: 'khaled@example.com', phone: '0501112233' },
      venue: { name: 'قاعة الأفراح الفاخرة', type: 'wedding' },
      eventDate: '2024-11-20',
      guests: 300,
      totalPrice: 7000,
      status: 'completed',
      createdAt: '2024-10-27T09:15:00Z'
    }
  ];

  const mockVenues: Venue[] = [
    {
      _id: '1',
      name: 'قاعة الأفراح الكبرى',
      type: 'wedding',
      capacity: 500,
      price: 5000,
      location: 'الرياض',
      description: 'قاعة فاخرة لحفلات الأفراح',
      images: [],
      amenities: ['واي فاي', 'موقف سيارات', 'تكييف'],
      status: 'active',
      createdAt: '2024-09-01T00:00:00Z'
    },
    {
      _id: '2',
      name: 'قاعة المؤتمرات الدولية',
      type: 'conference',
      capacity: 300,
      price: 3000,
      location: 'جدة',
      description: 'قاعة متخصصة للمؤتمرات والندوات',
      images: [],
      amenities: ['واي فاي', 'بروجيكتور', 'تكييف'],
      status: 'active',
      createdAt: '2024-08-15T00:00:00Z'
    }
  ];

  const mockPhotographers: Photographer[] = [
    {
      _id: '1',
      name: 'محمد المصور',
      email: 'mohamed@example.com',
      phone: '0509998888',
      specialty: ['أفراح', 'مناسبات'],
      portfolio: [],
      price: 2000,
      rating: 4.5,
      status: 'active',
      createdAt: '2024-07-20T00:00:00Z'
    },
    {
      _id: '2',
      name: 'أحمد الفنان',
      email: 'ahmed@example.com',
      phone: '0507776666',
      specialty: ['تصوير طبيعي', 'فوتوشوب'],
      portfolio: [],
      price: 1500,
      rating: 4.2,
      status: 'active',
      createdAt: '2024-08-10T00:00:00Z'
    }
  ];

  // جلب كل البيانات
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // علشان الاختبار، استخدم البيانات الوهمية
      // في الإنتاج، استخدم الـ API calls الحقيقية:
      /*
      const bookingsResponse = await axios.get('/api/bookings');
      const venuesResponse = await axios.get('/api/venues');
      const photographersResponse = await axios.get('/api/photographers');
      
      setBookings(bookingsResponse.data);
      setVenues(venuesResponse.data);
      setPhotographers(photographersResponse.data);
      */
      
      setTimeout(() => {
        setBookings(mockBookings);
        setVenues(mockVenues);
        setPhotographers(mockPhotographers);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // إذا فشل الـ API، استخدم البيانات الوهمية
      setBookings(mockBookings);
      setVenues(mockVenues);
      setPhotographers(mockPhotographers);
      setLoading(false);
    }
  };

  // إضافة قاعة جديدة
  const handleAddVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // في الإنتاج، استخدم:
      // const response = await axios.post('/api/venues', newVenue);
      
      const newVenueWithId = {
        ...newVenue,
        _id: Date.now().toString(),
        images: [],
        amenities: newVenue.amenities.filter(a => a.trim() !== ''),
        status: 'active' as const,
        createdAt: new Date().toISOString()
      };
      
      setVenues(prev => [...prev, newVenueWithId]);
      setNewVenue({
        name: '',
        type: 'wedding',
        capacity: 0,
        price: 0,
        location: '',
        description: '',
        amenities: ['']
      });
      setShowAddVenue(false);
    } catch (error) {
      console.error('Error adding venue:', error);
    }
  };

  // حذف قاعة
  const handleDeleteVenue = async (venueId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه القاعة؟')) {
      try {
        // في الإنتاج، استخدم:
        // await axios.delete(`/api/venues/${venueId}`);
        
        setVenues(prev => prev.filter(venue => venue._id !== venueId));
      } catch (error) {
        console.error('Error deleting venue:', error);
      }
    }
  };

  // إضافة مصور جديد
  const handleAddPhotographer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // في الإنتاج، استخدم:
      // const response = await axios.post('/api/photographers', newPhotographer);
      
      const newPhotographerWithId = {
        ...newPhotographer,
        _id: Date.now().toString(),
        portfolio: newPhotographer.portfolio.filter(p => p.trim() !== ''),
        specialty: newPhotographer.specialty.filter(s => s.trim() !== ''),
        rating: 0,
        status: 'active' as const,
        createdAt: new Date().toISOString()
      };
      
      setPhotographers(prev => [...prev, newPhotographerWithId]);
      setNewPhotographer({
        name: '',
        email: '',
        phone: '',
        specialty: [''],
        price: 0,
        portfolio: ['']
      });
      setShowAddPhotographer(false);
    } catch (error) {
      console.error('Error adding photographer:', error);
    }
  };

  // حذف مصور
  const handleDeletePhotographer = async (photographerId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المصور؟')) {
      try {
        // في الإنتاج، استخدم:
        // await axios.delete(`/api/photographers/${photographerId}`);
        
        setPhotographers(prev => prev.filter(p => p._id !== photographerId));
      } catch (error) {
        console.error('Error deleting photographer:', error);
      }
    }
  };

  // تحديث حالة الحجز
  const updateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      // في الإنتاج، استخدم:
      // await axios.patch(`/api/bookings/${bookingId}`, { status: newStatus });
      
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // إعدادات القائمة
  const tabs = [
    { id: 'bookings', name: 'طلبات الحجوزات', icon: Calendar },
    { id: 'venues', name: 'إدارة القاعات', icon: Building },
    { id: 'photographers', name: 'إدارة المصورين', icon: Camera },
    { id: 'stats', name: 'الإحصائيات', icon: BarChart3 }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الأدمن</h1>
              <p className="text-sm text-gray-600">الإدارة الكاملة للنظام</p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-right">
                <p className="text-gray-700 font-medium">مرحباً، {user.name}</p>
                <p className="text-sm text-gray-600">{user.role === 'superadmin' ? 'مدير عام' : 'مدير النظام'}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>تسجيل خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* القائمة الجانبية */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">القائمة</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 space-x-reverse p-3 text-right rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* المحتوى الرئيسي */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border">
                {/* طلبات الحجوزات */}
                {activeTab === 'bookings' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">طلبات الحجوزات</h2>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {bookings.length} طلب
                      </span>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">لا توجد طلبات حجوزات حالياً</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 space-x-reverse mb-2">
                                  <User className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{booking.user.name}</h3>
                                    <p className="text-sm text-gray-600">{booking.user.email} - {booking.user.phone}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                  <div>
                                    <p className="text-sm text-gray-600">القاعة</p>
                                    <p className="font-medium">{booking.venue.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">تاريخ المناسبة</p>
                                    <p className="font-medium">{new Date(booking.eventDate).toLocaleDateString('ar-SA')}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">عدد الضيوف</p>
                                    <p className="font-medium">{booking.guests} ضيف</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center space-x-2 space-x-reverse">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-blue-100 text-blue-800'
                                    }`}>
                                      {booking.status === 'pending' ? 'قيد الانتظار' :
                                       booking.status === 'confirmed' ? 'مؤكد' :
                                       booking.status === 'cancelled' ? 'ملغي' : 'مكتمل'}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {new Date(booking.createdAt).toLocaleDateString('ar-SA')}
                                    </span>
                                  </div>
                                  
                                  <div className="flex space-x-2 space-x-reverse">
                                    {booking.status === 'pending' && (
                                      <>
                                        <button
                                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                          className="flex items-center space-x-1 space-x-reverse bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                          <span>قبول</span>
                                        </button>
                                        <button
                                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                          className="flex items-center space-x-1 space-x-reverse bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                        >
                                          <XCircle className="w-4 h-4" />
                                          <span>رفض</span>
                                        </button>
                                      </>
                                    )}
                                    <button className="flex items-center space-x-1 space-x-reverse bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                                      <Eye className="w-4 h-4" />
                                      <span>عرض</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* إدارة القاعات */}
                {activeTab === 'venues' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">إدارة القاعات</h2>
                      <button
                        onClick={() => setShowAddVenue(true)}
                        className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                        <span>إضافة قاعة</span>
                      </button>
                    </div>

                    {venues.length === 0 ? (
                      <div className="text-center py-8">
                        <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">لا توجد قاعات مضافة حالياً</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venues.map((venue) => (
                          <div key={venue._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                              <span className={`px-2 py-1 rounded text-xs ${
                                venue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {venue.status === 'active' ? 'نشط' : 'غير نشط'}
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <p>السعة: {venue.capacity} شخص</p>
                              <p>السعر: {venue.price} ر.س</p>
                              <p>المكان: {venue.location}</p>
                              <p>النوع: {venue.type === 'wedding' ? 'أفراح' : 
                                        venue.type === 'conference' ? 'مؤتمرات' :
                                        venue.type === 'birthday' ? 'حفلات' : 'أخرى'}</p>
                            </div>

                            <div className="flex space-x-2 space-x-reverse mt-4">
                              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                                <Edit className="w-4 h-4 inline ml-1" />
                                تعديل
                              </button>
                              <button
                                onClick={() => handleDeleteVenue(venue._id)}
                                className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
                              >
                                <Trash2 className="w-4 h-4 inline ml-1" />
                                حذف
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* نموذج إضافة قاعة */}
                    {showAddVenue && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                          <h3 className="text-lg font-semibold mb-4">إضافة قاعة جديدة</h3>
                          <form onSubmit={handleAddVenue} className="space-y-4">
                            <input
                              type="text"
                              placeholder="اسم القاعة"
                              value={newVenue.name}
                              onChange={(e) => setNewVenue({...newVenue, name: e.target.value})}
                              className="w-full p-2 border rounded"
                              required
                            />
                            <select
                              value={newVenue.type}
                              onChange={(e) => setNewVenue({...newVenue, type: e.target.value as any})}
                              className="w-full p-2 border rounded"
                            >
                              <option value="wedding">قاعة أفراح</option>
                              <option value="conference">قاعة مؤتمرات</option>
                              <option value="birthday">قاعة حفلات</option>
                              <option value="other">أخرى</option>
                            </select>
                            <input
                              type="number"
                              placeholder="السعة"
                              value={newVenue.capacity}
                              onChange={(e) => setNewVenue({...newVenue, capacity: parseInt(e.target.value)})}
                              className="w-full p-2 border rounded"
                              required
                            />
                            <input
                              type="number"
                              placeholder="السعر"
                              value={newVenue.price}
                              onChange={(e) => setNewVenue({...newVenue, price: parseInt(e.target.value)})}
                              className="w-full p-2 border rounded"
                              required
                            />
                            <input
                              type="text"
                              placeholder="الموقع"
                              value={newVenue.location}
                              onChange={(e) => setNewVenue({...newVenue, location: e.target.value})}
                              className="w-full p-2 border rounded"
                              required
                            />
                            <textarea
                              placeholder="الوصف"
                              value={newVenue.description}
                              onChange={(e) => setNewVenue({...newVenue, description: e.target.value})}
                              className="w-full p-2 border rounded"
                              rows={3}
                            />
                            <div className="flex space-x-2 space-x-reverse">
                              <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                              >
                                إضافة
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowAddVenue(false)}
                                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                              >
                                إلغاء
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* إدارة المصورين */}
                {activeTab === 'photographers' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">إدارة المصورين</h2>
                      <button
                        onClick={() => setShowAddPhotographer(true)}
                        className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                        <span>إضافة مصور</span>
                      </button>
                    </div>

                    {photographers.length === 0 ? (
                      <div className="text-center py-8">
                        <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">لا توجد مصورين مضافة حالياً</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {photographers.map((photographer) => (
                          <div key={photographer._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-semibold text-gray-900">{photographer.name}</h3>
                              <span className={`px-2 py-1 rounded text-xs ${
                                photographer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {photographer.status === 'active' ? 'نشط' : 'غير نشط'}
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <p>البريد: {photographer.email}</p>
                              <p>الهاتف: {photographer.phone}</p>
                              <p>التخصص: {photographer.specialty.join('، ')}</p>
                              <p>السعر: {photographer.price} ر.س</p>
                              <p>التقييم: {photographer.rating} ⭐</p>
                            </div>

                            <div className="flex space-x-2 space-x-reverse mt-4">
                              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                                <Edit className="w-4 h-4 inline ml-1" />
                                تعديل
                              </button>
                              <button
                                onClick={() => handleDeletePhotographer(photographer._id)}
                                className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
                              >
                                <Trash2 className="w-4 h-4 inline ml-1" />
                                حذف
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* نموذج إضافة مصور */}
                    {showAddPhotographer && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                          <h3 className="text-lg font-semibold mb-4">إضافة مصور جديد</h3>
                          <form onSubmit={handleAddPhotographer} className="space-y-4">
                            <input
                              type="text"
                              placeholder="الاسم"
                              value={newPhotographer.name}
                              onChange={(e) => setNewPhotographer({...newPhotographer, name: e.target.value})}
                              className="w-full p-2 border rounded"
                              required
                            />
                            <input
                              type="email"
                              placeholder="البريد الإلكتروني"
                              value={newPhotographer.email}
                              onChange={(e) => setNewPhotographer({...newPhotographer, email: e.target.value})}
                              className="w-full p-2 border rounded"
                              required
                            />
                            <input
                              type="text"
                              placeholder="الهاتف"
                              value={newPhotographer.phone}
                              onChange={(e) => setNewPhotographer({...newPhotographer, phone: e.target.value})}
                              className="w-full p-2 border rounded"
                              required
                            />
                            <input
                              type="number"
                              placeholder="السعر"
                              value={newPhotographer.price}
                              onChange={(e) => setNewPhotographer({...newPhotographer, price: parseInt(e.target.value)})}
                              className="w-full p-2 border rounded"
                              required
                            />
                            <div className="flex space-x-2 space-x-reverse">
                              <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                              >
                                إضافة
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowAddPhotographer(false)}
                                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                              >
                                إلغاء
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* الإحصائيات */}
                {activeTab === 'stats' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">الإحصائيات</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600">إجمالي القاعات</p>
                            <p className="text-2xl font-bold text-blue-700">{venues.length}</p>
                          </div>
                          <Building className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600">إجمالي المصورين</p>
                            <p className="text-2xl font-bold text-green-700">{photographers.length}</p>
                          </div>
                          <Camera className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600">طلبات الحجوزات</p>
                            <p className="text-2xl font-bold text-purple-700">{bookings.length}</p>
                          </div>
                          <Calendar className="w-8 h-8 text-purple-600" />
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-orange-600">إجمالي الإيرادات</p>
                            <p className="text-2xl font-bold text-orange-700">
                              {bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)} ر.س
                            </p>
                          </div>
                          <DollarSign className="w-8 h-8 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;