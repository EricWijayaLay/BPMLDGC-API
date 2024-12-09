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
    suggestion = "Segera periksa ke dokter!";
  } else if (label === 'Non-cancer') {
    suggestion = "Penyakit kanker tidak terdeteksi.";
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
