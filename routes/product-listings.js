const express = require('express');
const parseDataUri = require('parse-data-uri')

const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { productListings } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('productListings');

// router.post('/actions/download-csv', permissionMiddlewareCreator.smartAction(), (request, response, next) => {
//   const recordId = request.body.data.attributes.ids[0]
//   response.setHeader('Content-Type', 'text/csv');
//   response.setHeader('Content-Disposition', `attachment; filename=list-${recordId}-download.csv`);
//   response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

//   return productListings.findByPk(recordId)
//     .then((record) => {
//       const csv = getCSVfromBase64(record.file);
//       record.status = 2;
//       return record.save().then(() => response.send(csv))
//     })
//     .catch((e) => response.status(400).send({error: `Cannot download file: ${e.message}`}))
// });

router.post('/actions/change-status', permissionMiddlewareCreator.smartAction(), (request, response, next) => {
  const recordIds = request.body.data.attributes.ids;
  return productListings.update({
    status: 'approved',
    updatedAt: Date.now(),
  }, { where: { id: recordIds } })
    .then(() => response.send({ success: 'Successfully enabled!' }))
    .catch((error) => response.status(400).send({ error: error.message }));
});

//NEJREE VERSION
router.post('/actions/download-csv', permissionMiddlewareCreator.smartAction(), (request, response, next) => {
  const recordId = request.body.data.attributes.ids[0]
  return productListings.findByPk(recordId)
    .then((record) => {
      const file = record.file;
      const fileName = record.file.match(/name=(.*)\;/) ? record.file.match(/name=(.*)\;/)[1] : `file-${recordId}-download.csv`
      const parsed = parseDataUri(record.file);
      response.setHeader('Content-Type', parsed.mimeType);
      response.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      return response.send(parsed.data)
    })
    .catch((e) => {
      console.log(e)
      response.status(400).send({error: `Cannot download file: ${e.message}`})
    })
});

// router.post('/actions/Download-products-file', permissionMiddlewareCreator.smartAction(), (request, response, next) => {
//   const recordId = request.body.data.attributes.ids[0]
//   return productFile.findByPk(recordId)
//     .then((record) => {
//       if (record.category == "product_images") {
//         return response.status(400).send({error: 'Sorry You can download products sheet only'});
//       }
//       const file = record.content;
//       // get the file name if included in the base64 string or generate generic name
//       const fileName = record.file.match(/name=(.*)\;/) ? record.file.match(/name=(.*)\;/)[1] : `file-${recordId}-download.csv`
//       const parsed = parseDataUri(record.content);
//       response.setHeader('Content-Type',  parsed.mimeType);
//       response.setHeader('Content-Disposition', `attachment; filename=list-${fileName}`);
//       response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
//       return response.send(csv)
//     })
//     .catch((e) => {
//       console.log(e.message);
//       response.status(400).send({error: `Cannot download file: ${e.message}`})})
// });

router.post('/actions/upload-reviewed-csv', permissionMiddlewareCreator.smartAction(), async (request, response) => {
  const recordId = request.body.data.attributes.ids[0];
  const { file } = request.body.data.attributes.values;
  console.log(request.body.data.attributes.values);

  const fileName = file.match(/name=(.*)\./)[1];
  const prefixMime = file.match(/\/(.*?);/)[1];
  const extension = file.match(/\.(.*?);/)[1];

  if ((prefixMime !== 'csv') && (extension !== 'csv')) {
    response.status(400).send({ error: 'please upload only csv file' });
  }

  //start - add the api call to your own service here if you wish to process the csv
  //myApiCall(file, fileName)
  //end

  return productListings.findByPk(recordId)
    .then((record) => {
      record.file = file;
      record.status = 3;
      record.reviewedBy = request.user.email;
      return record.save();
    })
    .then(() => response.send({ success: `file ${fileName} successfully uploaded` }))
    .catch((e) => response.status(400).send({ error: `Cannot upload file: ${e.message}` }));
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
