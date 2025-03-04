"use client";
import React, { useState, useEffect } from "react";

interface RubricDisplayProps {
  // The rubrics prop can be either a JSON string or an object
  rubrics: any | string;
  // Optional callback to be invoked when the user saves customizations.
  onSubmitCustomizations?: (customizedRubrics: any) => void;
}

const RubricDisplay: React.FC<RubricDisplayProps> = ({
  rubrics,
  onSubmitCustomizations,
}) => {
  // Parse the input data
  let parsedData: any;
  if (typeof rubrics === "string") {
    try {
      parsedData = JSON.parse(rubrics);
    } catch (error) {
      return (
        <pre className="text-red-600 whitespace-pre-wrap p-4 bg-red-50 rounded">
          Could not parse rubrics: {rubrics}
        </pre>
      );
    }
  } else {
    parsedData = rubrics;
  }

  // Extract rubric items
  let initialRubricItems: any[] = [];
  if (parsedData && Array.isArray(parsedData.rubrics)) {
    initialRubricItems = parsedData.rubrics;
  } else if (
    parsedData &&
    parsedData.rubrics &&
    Array.isArray(parsedData.rubrics.rubrics)
  ) {
    initialRubricItems = parsedData.rubrics.rubrics;
  }

  // Local state for rubric items, current question index, dirty flag, and errors
  const [rubricItems, setRubricItems] = useState<any[]>(initialRubricItems);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  // questionErrors[index] will hold an error string or null for that question
  const [questionErrors, setQuestionErrors] = useState<(string | null)[]>(
    Array(initialRubricItems.length).fill(null)
  );

  // Reset local states if the input rubrics change
  useEffect(() => {
    setRubricItems(initialRubricItems);
    setCurrentQuestionIndex(0);
    setIsDirty(false);
    setQuestionErrors(Array(initialRubricItems.length).fill(null));
  }, [JSON.stringify(initialRubricItems)]);

  /**
   * Recalculate the sum of sub-criteria for a question, compare to the total,
   * and return an error message if it doesn't match.
   */
  const validateQuestionMarks = (
    updatedItems: any[],
    itemIndex: number
  ): string | null => {
    const questionItem = updatedItems[itemIndex];
    if (!questionItem || !questionItem.rubric) return null;

    const total = questionItem.marks;
    const sumOfBreakdown = Object.values(questionItem.rubric).reduce(
      (acc: number, val: any) => acc + (val.marks || 0),
      0
    );

    if (sumOfBreakdown !== total) {
      return `Sub-criterion marks must sum to ${total}, but currently sum to ${sumOfBreakdown}.`;
    }
    return null;
  };

  // Generic function to update the questionErrors array
  const updateQuestionError = (
    updatedItems: any[],
    itemIndex: number
  ): void => {
    const newError = validateQuestionMarks(updatedItems, itemIndex);
    setQuestionErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[itemIndex] = newError;
      return updatedErrors;
    });
  };

  // Handler to update marks for a given rubric item and criterion
  const updateCriterionMark = (
    itemIndex: number,
    criterionKey: string,
    newMark: number
  ) => {
    setRubricItems((prevItems) => {
      const updatedItems = [...prevItems];
      const currentItem = { ...updatedItems[itemIndex] };

      if (currentItem.rubric && currentItem.rubric[criterionKey]) {
        currentItem.rubric[criterionKey] = {
          ...currentItem.rubric[criterionKey],
          marks: newMark,
        };
      }

      updatedItems[itemIndex] = currentItem;
      // Validate sum for that question
      updateQuestionError(updatedItems, itemIndex);
      return updatedItems;
    });
    setIsDirty(true);
  };

  // Handler to update the description for a given rubric item and criterion
  const updateCriterionDescription = (
    itemIndex: number,
    criterionKey: string,
    newDescription: string
  ) => {
    setRubricItems((prevItems) => {
      const updatedItems = [...prevItems];
      const currentItem = { ...updatedItems[itemIndex] };

      if (currentItem.rubric && currentItem.rubric[criterionKey]) {
        currentItem.rubric[criterionKey] = {
          ...currentItem.rubric[criterionKey],
          description: newDescription,
        };
      }

      updatedItems[itemIndex] = currentItem;
      return updatedItems;
    });
    setIsDirty(true);
  };

  // Handler for saving customizations (edited rubrics)
  const handleSave = () => {
    if (onSubmitCustomizations) {
      onSubmitCustomizations(rubricItems);
      setIsDirty(false);
    }
  };

  if (!rubricItems || rubricItems.length === 0) {
    return (
      <pre className="whitespace-pre-wrap p-4 bg-gray-50 rounded">
        {JSON.stringify(parsedData, null, 2)}
      </pre>
    );
  }

  // Get the current rubric item to display
  const currentRubricItem = rubricItems[currentQuestionIndex];
  // Get any error for the current question
  const currentError = questionErrors[currentQuestionIndex];

  // Optional: You can disable the Save button if ANY question has an error
  // const hasErrors = questionErrors.some((err) => err !== null);

  return (
    <div className="space-y-6">
      {/* 1) Top row with Previous (left), Question X of Y (center), Next (right) */}
      <div className="flex items-center w-full mb-4">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestionIndex === 0}
          className="py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 transition-colors duration-300"
        >
          &#8592; Previous
        </button>

        <div className="flex-1 text-center text-gray-800 font-medium">
          Question {currentQuestionIndex + 1} of {rubricItems.length}
        </div>

        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, rubricItems.length - 1)
            )
          }
          disabled={currentQuestionIndex === rubricItems.length - 1}
          className="py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 transition-colors duration-300"
        >
          Next &#8594;
        </button>
      </div>

      {/* 2) If unsaved changes exist, show Save button on a second row (right-aligned) */}
      {isDirty && onSubmitCustomizations && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSave}
            // If you want to disable the button when there's an error:
            // disabled={hasErrors}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* 3) Rubric Item Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500 transition duration-300 hover:shadow-2xl">
        <h3 className="text-2xl font-bold mb-2">
          Question {currentRubricItem.question_number}: {currentRubricItem.question}
        </h3>
        <p className="text-lg text-gray-700 mb-1">
          <strong>Bloom Taxonomy:</strong> {currentRubricItem.bloom_taxonomy}
        </p>
        <p className="text-lg text-gray-700 mb-4">
          <strong>Total Marks:</strong> {currentRubricItem.marks}
        </p>

        {/* Error message for the current question if the sub-criteria don't sum up */}
        {currentError && (
          <p className="text-red-600 font-semibold mb-4">{currentError}</p>
        )}

        {currentRubricItem.rubric &&
          Object.entries(currentRubricItem.rubric).map(([key, value]) => {
            const criterion = value as { description: string; marks: number };
            // Remap key "clarity_and_organization" to "Clarity and Organization"
            const displayKey =
              key === "clarity_and_organization" ? "Clarity and Organization" : key;

            return (
              <div
                key={key}
                className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-xl font-semibold text-gray-800 capitalize">
                    {displayKey}
                  </h4>
                  <div className="mt-2 sm:mt-0">
                    <span className="text-lg font-medium text-gray-700 mr-2">
                      Marks:
                    </span>
                    <select
                      value={criterion.marks}
                      onChange={(e) =>
                        updateCriterionMark(
                          currentQuestionIndex,
                          key,
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    >
                      {Array.from({ length: 21 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-gray-700 font-medium mb-1">
                    Description:
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    value={criterion.description}
                    onChange={(e) =>
                      updateCriterionDescription(currentQuestionIndex, key, e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RubricDisplay;
