const axios = require('axios');

module.exports = async function predictChildDyslexia({ age, phonemeMatching, letterRecognition, attention, patternMemory }) {
  try {
    const response = await axios.post('http://localhost:8000/predict-child', {
      age,
      phonemeMatching,
      letterRecognition,
      attention,
      patternMemory
    });

    return response.data.prediction; // expected to be 0 or 1 (false or true)
  } catch (error) {
    console.error('Error calling prediction model:', error.message);
    throw error;
  }
};
