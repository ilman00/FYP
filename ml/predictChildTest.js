const axios = require('axios');

module.exports = async function predictChildTest({ age, phonemeMatching, letterRecognition, attention, patternMemory }) {
  try {
    const response = await axios.post('http://13.232.124.239:8000/predict-child-test', {
      age,
      phonemeMatching_score: phonemeMatching.score,
      phonemeMatching_time: phonemeMatching.time,
      phonemeMatching_errors: phonemeMatching.errors,

      letterRecognition_score: letterRecognition.score,
      letterRecognition_time: letterRecognition.time,
      letterRecognition_errors: letterRecognition.errors,

      attention_score: attention.score,
      attention_time: attention.time,
      attention_errors: attention.errors,

      patternMemory_score: patternMemory.score,
      patternMemory_time: patternMemory.time,
      patternMemory_errors: patternMemory.errors
    });

    return response.data.prediction;
  } catch (error) {
    console.error('Prediction model error:', error);
    throw error;
  }
};
