app.get('/api/quiz', async (req, res) => {
  try {
    const response = await fetch("https://raw.githubusercontent.com/allrounder745/Mcq/main/data.json");
    const data = await response.json();

    const { start_time, interval_seconds, cricket_mcqs } = data;

    if (!start_time || !interval_seconds || !cricket_mcqs || cricket_mcqs.length === 0) {
      return res.status(500).json({ error: "Invalid quiz data!" });
    }

    const startTime = new Date(start_time).getTime();
    const now = Date.now();

    if (now < startTime) {
      return res.json({ message: "Quiz has not started yet!" });
    }

    const elapsed = Math.floor((now - startTime) / 1000); // seconds passed
    const currentIndex = (Math.floor(elapsed / interval_seconds)) % cricket_mcqs.length;

    const currentQuestion = cricket_mcqs[currentIndex];

    res.json({
      currentIndex,
      total: cricket_mcqs.length,
      question: currentQuestion.question,
      options: currentQuestion.options
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong!", detail: error.message });
  }
});
