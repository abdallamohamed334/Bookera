import sys
import json
import psycopg2
from PyQt5.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QFormLayout, QLineEdit, QTextEdit, QPushButton, QScrollArea, QLabel, QMessageBox
)

# ====== رابط الاتصال بالقاعدة ======
DB_URL = "postgresql://neondb_owner:npg_aX6CdsESTO2U@ep-wandering-dust-aetw28nj-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def get_connection():
    return psycopg2.connect(DB_URL)

# ====== دالة تحويل النص المفصول بفواصل إلى Array ======
def text_to_array(text):
    return [x.strip() for x in text.split(",") if x.strip()]

# ====== نافذة رئيسية ======
class VenueForm(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("إضافة قاعات أفراح")
        self.setGeometry(100, 100, 600, 700)

        main_layout = QVBoxLayout()

        # Scroll Area
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll_content = QWidget()
        self.form_layout = QFormLayout(scroll_content)
        scroll.setWidget(scroll_content)
        main_layout.addWidget(scroll)

        # إدخال الحقول
        self.entries = {}
        fields = [
            "ID", "اسم القاعة", "نوع القاعة", "الفئة", "المحافظة", "المدينة",
            "السعة", "السعر", "رقم التواصل", "البريد الإلكتروني", "العنوان",
            "الموقع الإلكتروني", "واتساب", "صور (URLs مفصولة بفواصل)",
            "مميزات (مفصولة بفواصل)", "خدمات (مفصولة بفواصل)",
            "قواعد (مفصولة بفواصل)", "فيديوهات (روابط مفصولة بفواصل)"
        ]

        for field in fields:
            if "مميزات" in field or "خدمات" in field or "قواعد" in field or "صور" in field or "فيديوهات" in field:
                widget = QTextEdit()
                widget.setFixedHeight(50)
            else:
                widget = QLineEdit()
            self.entries[field] = widget
            self.form_layout.addRow(QLabel(field), widget)

        # زر الحفظ
        save_button = QPushButton("حفظ القاعة")
        save_button.setStyleSheet("background-color: #4CAF50; color: white; font-weight: bold; height: 40px;")
        save_button.clicked.connect(self.save_venue)
        main_layout.addWidget(save_button)

        self.setLayout(main_layout)

    def save_venue(self):
        try:
            venue = {
                "id": self.entries["ID"].text(),
                "name": self.entries["اسم القاعة"].text(),
                "type": self.entries["نوع القاعة"].text(),
                "category": self.entries["الفئة"].text(),
                "governorate": self.entries["المحافظة"].text(),
                "city": self.entries["المدينة"].text(),
                "capacity": int(self.entries["السعة"].text()),
                "price": int(self.entries["السعر"].text()),
                "contact": self.entries["رقم التواصل"].text(),
                "email": self.entries["البريد الإلكتروني"].text(),
                "address": self.entries["العنوان"].text(),
                "website": self.entries["الموقع الإلكتروني"].text(),
                "whatsapp": self.entries["واتساب"].text(),
                "images": text_to_array(self.entries["صور (URLs مفصولة بفواصل)"].toPlainText()),
                "features": text_to_array(self.entries["مميزات (مفصولة بفواصل)"].toPlainText()),
                "amenities": text_to_array(self.entries["خدمات (مفصولة بفواصل)"].toPlainText()),
                "rules": text_to_array(self.entries["قواعد (مفصولة بفواصل)"].toPlainText()),
                "videos": text_to_array(self.entries["فيديوهات (روابط مفصولة بفواصل)"].toPlainText()),
                "wedding_specific": json.dumps({
                    "hasPool": False,
                    "hasWifi": True,
                    "openAir": False,
                    "catering": True,
                    "hasStage": True,
                    "brideRoom": True,
                    "groomRoom": True,
                    "hasGarden": False,
                    "maxGuests": 250,
                    "minGuests": 100,
                    "setupTime": 2,
                    "decoration": True,
                    "eventTypes": ["فرح","خطوبة","كتب_كتاب","عيد_ميلاد","مؤتمرات"],
                    "cleanupTime": 1,
                    "photography": True,
                    "soundSystem": True,
                    "lightingSystem": True,
                    "weddingPlanner": True,
                    "cateringService": True,
                    "parkingCapacity": 50,
                    "decorationService": True
                })
            }

            conn = get_connection()
            cur = conn.cursor()
            query = """
            INSERT INTO wedding_venues
            (id, name, type, category, governorate, city, capacity, price, contact, email, address,
            website, whatsapp, images, features, amenities, rules, videos, wedding_specific)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """
            cur.execute(query, (
                venue["id"], venue["name"], venue["type"], venue["category"],
                venue["governorate"], venue["city"], venue["capacity"], venue["price"],
                venue["contact"], venue["email"], venue["address"], venue["website"], venue["whatsapp"],
                venue["images"], venue["features"], venue["amenities"], venue["rules"], venue["videos"],
                venue["wedding_specific"]
            ))
            conn.commit()
            cur.close()
            conn.close()
            QMessageBox.information(self, "نجاح", "تم إضافة القاعة بنجاح!")
            self.clear_form()
        except Exception as e:
            QMessageBox.critical(self, "خطأ", str(e))

    def clear_form(self):
        for widget in self.entries.values():
            if isinstance(widget, QLineEdit):
                widget.clear()
            elif isinstance(widget, QTextEdit):
                widget.clear()

# ====== تشغيل التطبيق ======
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = VenueForm()
    window.show()
    sys.exit(app.exec_())
