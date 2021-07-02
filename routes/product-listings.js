const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { productListings } = require('../models');


const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('productListings');

function getCSVfromBase64(rawFile) {
  const rawFileCleaned = rawFile.replace('data:text/csv;base64', '');
  const buff = new Buffer(rawFileCleaned, 'base64');
  return buff.toString('ascii');
}

router.post('/actions/download-csv', permissionMiddlewareCreator.smartAction(), (request, response, next) => {
  const recordId = request.body.data.attributes.ids[0]
  response.setHeader('Content-Type', 'text/csv');
  response.setHeader('Content-Disposition', `attachment; filename=list-${recordId}-download.csv`);
  response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

  return productListings.findByPk(recordId)
    .then((record) => {
      const csv = getCSVfromBase64(record.file);
      record.status = 2;
      return record.save().then(() => response.send(csv))
    })
    .catch((e) => response.status(400).send({error: `Cannot download file: ${e.message}`}))
});

router.post('/actions/upload-reviewed-csv', permissionMiddlewareCreator.smartAction(), (request, response) => {
  const recordId = request.body.data.attributes.ids[0];
  const { file } = request.body.data.attributes.values;

  //start - add the api call to your own service here if you wish to process the csv
  const csv = getCSVfromBase64(file);
  //end

  return productListings.findByPk(recordId)
    .then((record) => {
      record.file = file;
      record.status = 3;
      record.reviewedBy = request.user.email;
      return record.save();
    })
    .then(() => response.send({ success: 'file successfully uploaded'}))
    .catch((e) => response.status(400).send({error: `Cannot upload file: ${e.message}`}));
});


// Create a Product Listing
router.post('/productListings', permissionMiddlewareCreator.create(), (request, response, next) => {

  request.body.data.attributes.createdBy = request.user.email

  next();
});

// Update a Product Listing
router.put('/productListings/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
  next();
});

// Delete a Product Listing
router.delete('/productListings/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
  next();
});

// Get a list of Product Listings
router.get('/productListings', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
  next();
});

// Get a number of Product Listings
router.get('/productListings/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
  next();
});

// Get a Product Listing
router.get('/productListings/:recordId(?!count)', permissionMiddlewareCreator.details(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
  next();
});

// Export a list of Product Listings
router.get('/productListings.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
  next();
});

// Delete a list of Product Listings
router.delete('/productListings', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
  next();
});

module.exports = router;
