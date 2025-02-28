"use client";
import React, { useState, useEffect } from "react";

interface RubricDisplayProps {
  // The rubrics prop can be either a JSON string or an object
  rubrics: any | string;
  // Optional callback to be invoked when the user submits customizations.
  onSubmitCustomizations?: (customizedRubrics: any) => void;
}

const RubricDisplay: React.FC<RubricDisplayProps> = ({ rubrics, onSubmitCustomizations }) => {
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

  // Extract rubric items (ignoring total marks and message now)
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

  // Local state to allow updates for each rubric item
  const [rubricItems, setRubricItems] = useState<any[]>(initialRubricItems);

  // Update local state if the input changes
  useEffect(() => {
    setRubricItems(initialRubricItems);
  }, [JSON.stringify(initialRubricItems)]);

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
      return updatedItems;
    });
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
  };

  // Handler for submitting customizations
  const handleSubmit = () => {
    if (onSubmitCustomizations) {
      onSubmitCustomizations(rubricItems);
    }
  };

  if (!rubricItems || rubricItems.length === 0) {
    return (
      <pre className="whitespace-pre-wrap p-4 bg-gray-50 rounded">
        {JSON.stringify(parsedData, null, 2)}
      </pre>
    );
  }

  return (
    <div className="space-y-6">
      {rubricItems.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500 transition duration-300 hover:shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-2">
            Question {item.question_number}: {item.question}
          </h3>
          <p className="text-lg text-gray-700 mb-1">
            <strong>Bloom Taxonomy:</strong> {item.bloom_taxonomy}
          </p>
          <p className="text-lg text-gray-700 mb-4">
            <strong>Total Marks:</strong> {item.marks}
          </p>
          {item.rubric &&
            Object.entries(item.rubric).map(([key, value]) => {
              const criterion = value as { description: string; marks: number };
              // Remap key "clarity_and_organization" to "Clarity and Organization"
              const displayKey =
                key === "clarity_and_organization"
                  ? "Clarity and Organization"
                  : key;

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
                          updateCriterionMark(index, key, parseInt(e.target.value, 10))
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
                        updateCriterionDescription(index, key, e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      ))}
      {onSubmitCustomizations && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Customizations
          </button>
        </div>
      )}
    </div>
  );
};

export default RubricDisplay;
