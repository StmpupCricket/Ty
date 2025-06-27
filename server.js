const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());

const QUIZ_URL = "https://raw.githubusercontent.com/allrounder745/Mcq/main/data.json";

app.get('/api/quiz', async (req, res) => {
  try {
    const response = await fetch(QUIZ_URL);
    const data = await response.json();

    const startTime = new Date(data.start_time).getTime();
    const now = Date.now();
    const interval = data.interval_seconds * 1000;
    const diff = now - startTime;
    const index = Math.floor(diff / interval);

    if (index < 0 || index >= data.questions.length) {
      return res.json({ message: "🛑 Quiz not started yet or finished!" });
    }

    const question = data.questions[index];
    const timeLeft = interval - (diff % interval);

    res.json({
      current_index: index + 1,
      question,
      time_left: timeLeft
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!", detail: error.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Quiz API running on port 3000");
});
