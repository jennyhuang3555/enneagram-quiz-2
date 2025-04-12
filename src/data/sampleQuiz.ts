export const sampleQuiz = {
  title: "Enneagram Assessment",
  description: "Discover your Enneagram type",
  questions: [], // Your questions will be loaded dynamically
  resultRanges: [
    {
      id: "1",
      category: "type1",
      minScore: 0,
      maxScore: 25,
      title: "Type 1",
      description: "The Reformer"
    },
    {
      id: "2",
      category: "type2",
      minScore: 0,
      maxScore: 25,
      title: "Type 2",
      description: "The Helper"
    },
    // ... add other types as needed
  ]
}; 