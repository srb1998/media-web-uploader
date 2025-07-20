require('dotenv').config();
const fs = require('fs');
const config = `
window.cloudinaryConfig = {
    cloudName: '${process.env.CLOUDINARY_CLOUD_NAME}',
    uploadPreset: '${process.env.CLOUDINARY_UPLOAD_PRESET}'
};
`;
fs.writeFileSync('config.js', config);