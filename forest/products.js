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
  },{
    field: 'image list html',
    type: 'String',
    get: (record) => {
      const imagesArray = record.images.split(',')
      let htmlList = ""
      let carouselItems = ""
      imagesArray.forEach((object, index) => {
        let statusClass = index === 0 ? "active" : ""
        htmlList += `<li data-target="#imageCarousel" data-slide-to="${index}" class="${statusClass}"></li>`
        carouselItems += `<div class="carousel-item ${statusClass}">
              <img class="d-block w-100" src="${object}" alt="slide ${index}">
            </div>`
      })
      return `
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <div id="imageCarousel" class="carousel slide" style="width:300px;background-color:coral" data-ride="carousel">
          <ol class="carousel-indicators">
            ${htmlList}
          </ol>
          <div class="carousel-inner">
            ${carouselItems}
          </div>
          <a class="carousel-control-prev" href="#imageCarousel" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#imageCarousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>

      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
      `
    }
  }],
  segments: [],
});
