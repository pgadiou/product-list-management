const { collection } = require('forest-express-sequelize');

collection('products', {
  actions: [{
    name: 'download pdf',
    download: true,
  }],
  fields: [{
    field: 'image list',
    type: ['String'],
    get: (record) => record.images.split(','),
  }],
  segments: [],
});
