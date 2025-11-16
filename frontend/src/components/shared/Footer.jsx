const Footer = ({ onNavigateHome }) => {
  const governorates = {
    "الغربية": { 
      cities: ["طنطا", "المحلة الكبرى", "زفتى", "سمنود", "بسيون", "قطور", "السنطه", "كفر الزيات", "صفتا", "شيخون"] 
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4">قاعات الأفراح في الغربية</h4>
            <p className="text-gray-400 text-sm">
              منصة متكاملة لاكتشاف أفضل قاعات الأفراح في محافظة الغربية
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={onNavigateHome} className="hover:text-white transition-colors">الصفحة الرئيسية</button></li>
              <li><button className="hover:text-white transition-colors">قائمة المفضلة</button></li>
              <li><button className="hover:text-white transition-colors">شروط الاستخدام</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">المدن</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {governorates.الغربية.cities.map(city => (
                <li key={city}><button className="hover:text-white transition-colors">{city}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">التواصل</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>للإعلان أو الدعم الفني:</p>
              <p>info@example.com</p>
              <p>+20 100 000 0000</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2024 قاعات الأفراح في الغربية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;