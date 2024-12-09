const storeData = require('../services/storeData');
const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
  await storeData(id, data);
  
  // Cek ukuran payload untuk menghindari 413
  if (Buffer.byteLength(image, 'base64') > 1000000) {
    return h.response({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000'
    }).code(413);
  }

  try {
    // Lakukan prediksi
    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt
    };

    // Menentukan pesan berdasarkan hasil label
    let message = '';
    if (label === 'Non-cancer') {
      message = 'Model is predicted successfully';
    } else if (label === 'Cancer') {
      message = 'Model is predicted successfully';
    } 

    // Mengirimkan response sesuai format yang diberikan
    return h.response({
      status: 'success',
      message: message,
      data: data
    }).code(201); // Status 201 untuk success

  } catch (error) {
    // Menangani kesalahan jika prediksi gagal
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    }).code(400); // Status 400 untuk kesalahan pada request
  }
}

module.exports = postPredictHandler;
