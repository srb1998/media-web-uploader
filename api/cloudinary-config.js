export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
  } else {
    return res.status(405).send('Method Not Allowed');
  }
}
