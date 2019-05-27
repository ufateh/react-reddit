import React from 'react';

const WallpaperItem = ({file}) => {
    let previewImage = file.data.preview ? file.data.preview.images[0].resolutions[3].url : "http://dummyimage.com";
    previewImage = previewImage.replace(/&amp;/g,"&");
    return (
        <div className="col-sm-12 col-md-4 col-lg-3">
            <div className="card">
                <div className="card-img-top">
                    <img src={previewImage} width="100%"/>
                    {console.log(previewImage)}
                </div>
            </div>
            {file.data.name}
        </div>
    );
} 

export default WallpaperItem;