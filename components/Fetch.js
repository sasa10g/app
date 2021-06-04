import { useEffect, useState } from 'react'

const Fetch = () => {
    const [data, setData] = useState()
    const photosPrefix = 'https://dimedia-nekretnine.nekretninebrcko.com/thumb.php?file='

    useEffect(() => {
        fetch(window.location.href + 'api/hello')
            .then(response => response.json())
            .then(data => setData(data.realEstates.realEstate));
    }, [])

    console.log(data)
    //console.log(data.re_photo[0].re_photos_name._cdata)
    var x = data?.re_photo[0]?.re_photos_name?._cdata;
    return (
        <>
            <p>{data?.re_realEstates_code?._cdata}</p>
            <img style={{ width: '300px' }} src={photosPrefix + x} />
        </>
    )
}

export default Fetch