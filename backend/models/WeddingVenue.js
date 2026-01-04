import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const WeddingVenue = sequelize.define('WeddingVenue', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('قاعة أفراح', 'حديقة خارجية', 'فيلا', 'قاعة فندقية'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('فاخرة', 'طبيعية', 'كلاسيكية', 'عصرية', 'اقتصادية'),
    allowNull: false
  },
  governorate: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 10
    }
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  features: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 5
    },
    defaultValue: 0
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  rules: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  weddingSpecific: {
    type: DataTypes.JSONB,
    defaultValue: {
      brideRoom: false,
      photography: false,
      catering: false,
      decoration: false,
      maxGuests: 0
    }
  }
}, {
  tableName: 'wedding_venues',
  timestamps: true,
  indexes: [
    {
      fields: ['governorate', 'city']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['available']
    },
    {
      fields: ['rating']
    }
  ]
});

export default WeddingVenue;