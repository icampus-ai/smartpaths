import axios from "axios";

export const uploadFileToBackend = async (file: File, fileType: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", fileType);

  await axios.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const evaluateFiles = async (
  files: { [key: string]: File | null },
  difficultyLevel: string
) => {
  const formData = new FormData();
  if (files.modelQA) formData.append("modelQuestionAnswer", files.modelQA);
  if (files.responses) {
    formData.append("studentAnswers", files.responses);
  }
  formData.append("difficultyLevel", difficultyLevel);

  await axios.post("/evaluate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
