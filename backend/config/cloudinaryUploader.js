// utils/cloudinaryUploader.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Credenciales
const PRIMARY = {
  cloud_name: 'drifckfyd',
  api_key: '467838233879636',
  api_secret: 'b7OXEav8x9lOP6kzahGv4q56e8Y',
  preset: 'subida_de_imagenes',
};

// const BACKUP = {
//   cloud_name: '',
//   api_key: '',
//   api_secret: '',
//   preset: '',
// };

async function getCreditUsage({ cloud_name, api_key, api_secret }) {
  try {
    const res = await axios.get(`https://api.cloudinary.com/v1_1/${cloud_name}/usage`, {
      auth: { username: api_key, password: api_secret },
    });
    return res.data.credits.used_percent;
  } catch (error) {
    console.error('Error consultando uso de créditos:', error.response?.data || error.message);
    return 100; // Forzar uso de respaldo
  }
}

async function uploadImage(filePath) {
  const shouldUseBackup = (await getCreditUsage(PRIMARY)) >= 100;
  const credentials = shouldUseBackup ? BACKUP : PRIMARY;

  const url = `https://api.cloudinary.com/v1_1/${credentials.cloud_name}/image/upload`;
  const data = new FormData();
  data.append('file', fs.createReadStream(filePath));
  data.append('upload_preset', credentials.preset);

  try {
    const res = await axios.post(url, data, {
      headers: data.getHeaders(),
    });

    return res.data.secure_url;
  } catch (error) {
    console.error('Error subiendo imagen:', error.response?.data || error.message);
    return null;
  }
}

module.exports = { uploadImage };
