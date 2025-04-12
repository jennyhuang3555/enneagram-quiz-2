import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizResult } from '@/services/firebase';
import QuizResults from '@/components/QuizResults';

const ResultPage = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getQuizResult(resultId);
        setResult(data);
      } catch (err) {
        console.error('Error fetching result:', err);
      } finally {
        setLoading(false);
      }
    };

    if (resultId) {
      fetchResult();
    }
  }, [resultId]);

  if (loading) return <div>Loading...</div>;
  if (!result) return <div>Result not found</div>;

  return (
    <QuizResults
      scores={result.scores}
      responses={result.responses}
      onClose={() => window.close()}
    />
  );
};

export default ResultPage; 