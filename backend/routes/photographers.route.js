import express from 'express';
import Photographer from '../models/Photographer.js';

const router = express.Router();

// GET جميع المصورين
router.get('/', async (req, res) => {
  try {
    const {
      governorate,
      city,
      specialty,
      minExperience,
      maxPrice,
      minRating,
      services,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    if (governorate && governorate !== 'all') {
      query.governorate = governorate;
    }

    if (city && city !== 'all' && city !== 'كل المدن') {
      query.city = city;
    }

    if (specialty && specialty !== 'all') {
      query.specialty = specialty;
    }

    if (minExperience) {
      query.experience = { $gte: parseInt(minExperience) };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (services) {
      query.services = { $in: services.split(',') };
    }

    // معالجة السعر (سنتعامل مع price كـ string في الاستعلام الأولي)
    let priceQuery = {};
    if (maxPrice) {
      // يمكن إضافة منطق معالجة السعر هنا إذا كان رقمياً
    }

    const photographers = await Photographer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, experience: -1 });

    const total = await Photographer.countDocuments(query);

    res.json({
      photographers,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET مصور محدد بالـ ID
router.get('/:id', async (req, res) => {
  try {
    const photographer = await Photographer.findById(req.params.id);
    if (!photographer) {
      return res.status(404).json({ message: 'المصور غير موجود' });
    }
    res.json(photographer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET المحافظات المتاحة
router.get('/meta/governorates', async (req, res) => {
  try {
    const governorates = await Photographer.distinct('governorate');
    res.json(governorates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET المدن المتاحة في محافظة محددة
router.get('/meta/cities/:governorate', async (req, res) => {
  try {
    const cities = await Photographer.distinct('city', {
      governorate: req.params.governorate
    });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET التخصصات المتاحة
router.get('/meta/specialties', async (req, res) => {
  try {
    const specialties = await Photographer.distinct('specialty');
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET الخدمات المتاحة
router.get('/meta/services', async (req, res) => {
  try {
    const services = await Photographer.distinct('services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET الباقات لـ مصور محدد
router.get('/:id/packages', async (req, res) => {
  try {
    const photographer = await Photographer.findById(req.params.id);
    if (!photographer) {
      return res.status(404).json({ message: 'المصور غير موجود' });
    }
    res.json(photographer.packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;