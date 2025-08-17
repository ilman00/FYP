const axios = require('axios');

module.exports = async function modelPrediction(payload) {
  try {
    const response = await axios.post(`${process.env.PYTHON_URL}/predict-english-test`, payload);
    console.log("model Predidction ",response.prediction);
    return response.data.prediction; // e.g. true / false
  } catch (error) {
    console.error('Error calling prediction model:', error.message);
    if (error.response) {
      console.error("Python response:", error.response.data);
    }
    throw error;
  }
};
