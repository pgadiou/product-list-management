# product-list-management

## Adding information about the user when creating a product listing

You can find an extension of the POST route in the routes/product_listings.js file to add the information of the user who triggered the action and persist it in the created_by field.

## Adding smart action to download a csv file

You can find the declaration of the action "download csv" in the forest/product_listings.js file and the implementation of the action's logic in the routes/product_listing.js file.

The action transforms the file stored as a base64 string into an ASCII string and sends it with the formatted response to the frontend.

## Adding smart action to upload an edited csv file 

You can find the declaration of the action "upload reviewed csv" in the forest/product_listings.js file and the implementation of the action's logic in the routes/product_listing.js file.

The action stores the file added by the user in the input form in the database and updates the status of the record. You can add in the action's implementation any logic to forward the file to a custom service before saving it.
