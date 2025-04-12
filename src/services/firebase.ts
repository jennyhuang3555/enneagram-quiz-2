import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { QuestionResponse } from '@/types/quiz';

interface QuizResult {
  name: string;
  email: string;
  scores: { [key: string]: number };
  responses: QuestionResponse[];
  dominant_type: string;
  second_type: string;
  third_type: string;
  created_at: string;
}

export const saveQuizResult = async (result: QuizResult): Promise<string> => {
  try {
    const docRef = doc(collection(db, 'quiz-results'));
    await setDoc(docRef, result);
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
};

export const getQuizResult = async (resultId: string): Promise<QuizResult | null> => {
  try {
    const docRef = doc(db, 'quiz-results', resultId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as QuizResult;
    }
    return null;
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    throw error;
  }
}; 