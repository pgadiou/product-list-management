const { collection } = require('forest-express-sequelize');

collection('products', {
  actions: [],
  fields: [{
    field: 'image list',
    type: ['String'],
    get: (record) => record.images.split(','),
  }],
  segments: [],
});
