import { useEffect, useState } from "react";
import axios from "axios";
import convert from "xml-js";

const Fetch = () => {
  const [data, setData] = useState();
  const photosPrefix =
    "https://dimedia-nekretnine.nekretninebrcko.com/thumb.php?file=";

  useEffect(() => {
    // fetch(window.location.href + "api/get")
    //   .then((response) => response.json())
    //   .then((data) => setData(data?.realEstates?.realEstate));

    axios
      .get(
        "https://dimedia-nekretnine.nekretninebrcko.com/synchronization_data/web/xml.xml",
        {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
          },
          mode: "no-cors",
        }
      )
      .then(function (response) {
        var data = response.data;
        var result1 = convert.xml2json(data, { compact: true, spaces: 4 });
        //var result2 = convert.xml2json(data, { compact: false, spaces: 4 });
        setData(JSON.parse(result1));
        //res.status(200).json(JSON.parse(result1));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  console.log(data);
  //console.log(data.re_photo[0].re_photos_name._cdata)
  var x = data?.re_photo[0]?.re_photos_name?._cdata;
  return (
    <>
      <p>{data?.re_realEstates_code?._cdata}</p>
      <img style={{ width: "300px" }} src={photosPrefix + x} />
    </>
  );
};

export default Fetch;
