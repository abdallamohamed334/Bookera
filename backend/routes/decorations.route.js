import express from 'express';
import Decoration from '../models/Decoration.js';

const router = express.Router();

// GET جميع مزودي الديكور
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

    if (maxPrice) {
      query['priceRange.min'] = { $lte: parseInt(maxPrice) };
    }

    const decorators = await Decoration.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, experience: -1 });

    const total = await Decoration.countDocuments(query);

    res.json({
      decorators,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET مزود ديكور محدد بالـ ID
router.get('/:id', async (req, res) => {
  try {
    const decorator = await Decoration.findById(req.params.id);
    if (!decorator) {
      return res.status(404).json({ message: 'مزود الديكور غير موجود' });
    }
    res.json(decorator);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET المحافظات المتاحة
router.get('/meta/governorates', async (req, res) => {
  try {
    const governorates = await Decoration.distinct('governorate');
    res.json(governorates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET المدن المتاحة في محافظة محددة
router.get('/meta/cities/:governorate', async (req, res) => {
  try {
    const cities = await Decoration.distinct('city', {
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
    const specialties = await Decoration.distinct('specialty');
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET الخدمات المتاحة
router.get('/meta/services', async (req, res) => {
  try {
    const services = await Decoration.distinct('services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET الباقات لـ مزود ديكور محدد
router.get('/:id/packages', async (req, res) => {
  try {
    const decorator = await Decoration.findById(req.params.id);
    if (!decorator) {
      return res.status(404).json({ message: 'مزود الديكور غير موجود' });
    }
    res.json(decorator.packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;