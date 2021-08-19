const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { products } = require('../models');
const easyinvoice = require('easyinvoice');


const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('products');

router.post('/actions/download-pdf', permissionMiddlewareCreator.smartAction(), async (request, response) => {
  const recordIds = request.body.data.attributes.ids
  response.setHeader('Content-Type', 'application/pdf');
  response.setHeader('Content-Disposition', `attachment; filename=list-download.pdf`);
  response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

  const records = await products.findAll({ where : {id: recordIds}});

  const productList = records.map((record) => {
    return {
      "quantity": "1",
      "description": record.name,
      "tax": `15`,
      "price": `${record.price/100}`
    }
  })

  const date = new Date();

  var data = {
    //"documentTitle": "RECEIPT", //Defaults to INVOICE
    //"locale": "de-DE", //Defaults to en-US, used for number formatting (see docs)
    "currency": "USD", //See documentation 'Locales and Currency' for more info
    "taxNotation": "vat", //or gst
    "marginTop": 25,
    "marginRight": 25,
    "marginLeft": 25,
    "marginBottom": 25,
    "logo": "https://img2.pngio.com/nike-air-max-sneakers-air-jordan-shoe-basketball-shoes-png-pngwave-sneakers-shoes-png-910_450.png",
    "background": null, //or base64 //img or pdf
    "sender": {
        "company": "My Sneakers Marketplace",
        "address": "Sample Street 123",
        "zip": "1234 AB",
        "city": "Sampletown",
        "country": "Samplecountry"
    },
    "client": {
        "company": "Client Corp",
        "address": "Clientstreet 456",
        "zip": "4567 CD",
        "city": "Clientcity",
        "country": "Clientcountry"
        //"custom1": "custom value 1",
        //"custom2": "custom value 2",
        //"custom3": "custom value 3"
    },
    "invoiceNumber": `test${date.getDate()}${date.getMonth()}`,
    "invoiceDate": `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`,
    "products": productList,
    "bottomNotice": "Kindly pay your invoice within 15 days.",
  };

  return easyinvoice.createInvoice(data).then((result) => {
    // created a base64 string, now converting it into buffer to send to the frontend
    const download = Buffer.from(result.pdf.toString('utf-8'), 'base64')
    return response.send(download)
  }).catch((e) => response.status(400).send({error: `Cannot download file: ${e.message}`}))

});


// Create a Product
router.post('/products', permissionMiddlewareCreator.create(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
  next();
});

// Update a Product
router.put('/products/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
  next();
});

// Delete a Product
router.delete('/products/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
  next();
});

// Get a list of Products
router.get('/products', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
  next();
});

// Get a number of Products
router.get('/products/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
  next();
});

// Get a Product
router.get('/products/:recordId(?!count)', permissionMiddlewareCreator.details(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
  next();
});

// Export a list of Products
router.get('/products.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
  next();
});

// Delete a list of Products
router.delete('/products', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
  next();
});

module.exports = router;
