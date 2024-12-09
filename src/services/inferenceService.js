const tf = require('@tensorflow/tfjs-node');
const { v4: uuidv4 } = require('uuid'); // Menggunakan uuid untuk menghasilkan ID unik

async function predictClassification(model, image) {
  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat();
 
  const prediction = model.predict(tensor);
 
  const classes = ['Cancer', 'Non-cancer'];
 
  const classResult = tf.argMax(prediction, 1).dataSync()[0];
  const label = classes[classResult];
 
  let explanation, suggestion;
 
  if (label === 'Cancer') {
    explanation = "Melanocytic nevus adalah kondisi di mana permukaan kulit memiliki bercak warna yang berasal dari sel-sel melanosit, yakni pembentukan warna kulit dan rambut.";
    suggestion = "Segera konsultasi dengan dokter terdekat jika ukuran semakin membesar dengan cepat, mudah luka atau berdarah.";
  } else if (label === 'Non-cancer') {
    explanation = "Kondisi ini tidak teridentifikasi sebagai kanker, namun tetap perlu perhatian medis.";
    suggestion = "Disarankan untuk memonitor perubahan kondisi kulit dan berkonsultasi dengan dokter jika ada perubahan signifikan.";
  }

  const result = {
    status: "success",
    message: "Model is predicted successfully",
    data: {
      id: uuidv4(), // Menghasilkan ID unik untuk setiap prediksi
      result: label,
      suggestion: suggestion,
      createdAt: new Date().toISOString() // Timestamp saat prediksi dibuat
    }
  };
 
  return result;
}

module.exports = predictClassification;
