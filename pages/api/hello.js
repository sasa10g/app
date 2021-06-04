// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {

  var convert = require('xml-js');
  var axios = require('axios');

  axios
    .get('https://dimedia-nekretnine.nekretninebrcko.com/synchronization_data/web/xml.xml', {
      headers: {
        'Content-Type': "application/xml; charset=utf-8",
      },
      mode: 'no-cors',
    })
    .then(function (response) {
      var data = response.data;
      var result1 = convert.xml2json(data, { compact: true, spaces: 4 });
      //var result2 = convert.xml2json(data, { compact: false, spaces: 4 });
      res.status(200).json(JSON.parse(result1))
    })
    .catch(function (error) {
      console.log(error);
    });




}
