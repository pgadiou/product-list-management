const { collection } = require('forest-express-sequelize');
const { users } = require('../models');

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments
collection('productListings', {
  actions: [{
    name: 'download csv',
    type: 'single',
    download: true,
  },{
    name: 'change status',
  },{
    name: 'upload reviewed csv',
    type: 'single',
    fields: [{
      field: 'file',
      type: 'string',
      widget: 'file picker',
    }]
  }],
  fields: [{
    field: 'database user',
    type: 'String',
    reference: 'users',
    get: (record) => users.findOne({ where: { email: record.createdBy }}).then((user) => user).catch((e) => null)
  }, {
    field: 'fileName',
    type: 'String',
    get: (record) => record.file.match(/name=(.*)\;/) ? decodeURIComponent(record.file.match(/name=(.*)\;/)[1]) : null,
  }],
  segments: [],
  searchFields: ['createdBy'],
});
