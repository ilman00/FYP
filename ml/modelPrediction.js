const axios = require('axios');

module.exports = async function modelPrediction(payload) {
  try {
    const response = await axios.post('http://3.108.65.38:8000/predict-english-test', payload);
    return response.data.prediction; // e.g. true / false
  } catch (error) {
    console.error('Error calling prediction model:', error.message);
    if (error.response) {
      console.error("Python response:", error.response.data);
    }
    throw error;
  }
};
