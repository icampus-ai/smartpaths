import { useState } from 'react';

interface Evaluation {
  id: number;
  studentId: string;
  status: 'completed' | 'pending';
}

export default function EvaluationSystem() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    { id: 1, studentId: 'S001', status: 'completed' },
  ]);

  const handleMarkAsCompleted = (evaluation: Evaluation) => {
    setEvaluations(
      evaluations.map((e) =>
        e.id === evaluation.id ? { ...e, status: 'completed' } : e
      )
    );
  };

  const handleMarkAsPending = (evaluation: Evaluation) => {
    setEvaluations(
      evaluations.map((e) =>
        e.id === evaluation.id ? { ...e, status: 'pending' } : e
      )
    );
  };

  const handleStatusChange = (evaluation: Evaluation, status: 'completed' | 'pending') => {
    if (status === 'completed') {
      handleMarkAsCompleted(evaluation);
    } else {
      handleMarkAsPending(evaluation);
    }
  };

  const handleSave = () => {
    // Implement save functionality here
    console.log('Evaluations saved:', evaluations);
  };

  return (
    <div className="flex flex-col items-center p-4 rounded">
      <h1 className="text-2xl font-bold mb-4">Evaluation Status</h1>
      <div className="w-full p-4 rounded">
        <ul>
          {evaluations.map((evaluation) => (
            <li key={evaluation.id} className="mb-2 p-2 flex justify-between">
              <select
                className="w-1/2 p-2 border border-gray-200 rounded"
                value={evaluation.studentId}
              >
                <option value="S001">S001</option>
                <option value="S002">S002</option>
                <option value="S003">S003</option>
              </select>
              <select
                className="w-1/2 p-2 border border-gray-200 rounded"
                value={evaluation.status}
                onChange={(e) => handleStatusChange(evaluation, e.target.value as 'completed' | 'pending')}
              >
                <option value="completed">Mark as Completed</option>
                <option value="pending">Mark as Pending</option>
              </select>
            </li>
          ))}
        </ul>
        <button
          onClick={handleSave}
          className="mt-4 py-2 px-6 rounded-lg bg-black text-white shadow-md text-center justfify-center hover:opacity-90 transition-opacity"
        >
          Save
        </button>
      </div>
    </div>
  );
}