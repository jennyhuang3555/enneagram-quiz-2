import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizResult } from '@/services/firebase';
import QuizResults from '@/components/QuizResults';

const Results = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getQuizResult(resultId);
        setResult(data);
      } catch (err) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    if (resultId) {
      fetchResult();
    }
  }, [resultId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!result) return <div>Result not found</div>;

  return <QuizResults quiz={sampleQuiz} scores={result.scores} responses={result.responses} />;
};

export default Results; 