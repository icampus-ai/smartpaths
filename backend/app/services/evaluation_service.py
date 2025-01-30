import base64
import easyocr
import numpy as np
from pdf2image import convert_from_bytes
from docx import Document
from PIL import Image, ImageEnhance, ImageFilter
import cv2
from skimage import exposure  # For contrast stretching
import numpy as np
import io
from PyPDF2 import PdfReader
from ai_model.model.grading_system.grader import grade_student_answers_v2
from ai_model.model.grading_system.rubrics import generate_rubrics
from ai_model.model.grading_system.get_overall_feedback import get_overall_feedback
from backend.app.utils.file_type import (
    extract_pdf_text, 
    extract_docx_text, 
    save_as_docx, 
    save_as_pdf, 
    save_as_text, 
    extract_model_data, 
    extract_student_data, 
    append_grading_results,
    generate_summary
)

def is_valid_pdf(file_content):
    """Check if a file is a valid PDF before processing."""
    try:
        reader = PdfReader(io.BytesIO(file_content))
        return len(reader.pages) > 0
    except Exception:
        return False

def check_empty_image(image):
    """Check if the image is empty before processing."""
    if image is None or image.size == 0:
        raise ValueError("Input image is empty or invalid.")
    return image

def convert_to_grayscale(image):
    """Convert image to grayscale if it is not already."""
    image = np.array(image)
    if len(image.shape) > 2:  # If it has more than one channel (i.e., a color image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)  # Convert to grayscale
    return image

def adaptive_binarization(image):
    """Apply adaptive thresholding to binarize the image for better contrast."""
    return cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                 cv2.THRESH_BINARY, 11, 2)

def denoise_image(image):
    """Apply denoising to remove unwanted noise."""
    return cv2.fastNlMeansDenoising(image, None, 30, 7, 21)

def preprocess_image(image):
    """Enhance image quality for better OCR results."""
    # Ensure the image is in a valid format (grayscale or RGB)
    image = check_empty_image(image)  # Check for empty images
    image = convert_to_grayscale(image)  # Ensure grayscale

    # Apply preprocessing techniques for handwritten text
    image = adaptive_binarization(image)  # Adaptive binarization
    image = denoise_image(image)  # Denoise

    # Convert the processed image back to a PIL Image
    image = Image.fromarray(image)
    image = image.filter(ImageFilter.SHARPEN)  # Sharpen the image
    image = image.resize((image.width * 2, image.height * 2), Image.LANCZOS)  # Resize image

    return image

def extract_text_from_handwritten_image(image):
    """Extract text from a handwritten document image using Tesseract."""
    # Preprocess image for better OCR accuracy
    preprocessed_image = preprocess_image(image)

    # Convert preprocessed image to numpy array (for Tesseract)
    image_np = np.array(preprocessed_image)

    # Use Tesseract to extract text, specifying the OCR engine mode for handwriting
    custom_config = r'--oem 1 --psm 6'  # Set OEM to 1 for deep learning-based OCR
    extracted_text = pytesseract.image_to_string(image_np, config=custom_config)

    return extracted_text



def extract_text_from_handwritten_image(image):
    """Extract text from a handwritten document image using OCR."""
    reader = easyocr.Reader(['en'], gpu=False)  # Explicitly set gpu to False
    image = preprocess_image(image)
    image_np = np.array(image)  # Convert PIL image to numpy array
    result = reader.readtext(image_np, detail=1)  # Set detail to 1 for more detailed results
    return ' '.join([text for _, text, _ in result])


def extract_text_from_pdf(file_content):
    """Extract both printed and handwritten text from a PDF."""
    if not is_valid_pdf(file_content):
        print("Invalid or corrupted PDF file.")
        return ""

    try:
        printed_text = extract_pdf_text(file_content)
        if printed_text.strip():
            return printed_text  # If printed text is found, return it
    except Exception as e:
        print(f"Error extracting printed text: {e}")

    try:
        images = convert_from_bytes(file_content)
        handwritten_text = "\n".join(extract_text_from_handwritten_image(image) for image in images)
        return handwritten_text
    except Exception as e:
        print(f"Error extracting handwritten text: {e}")

    return ""

def extract_text_from_docx(file_content):
    """Extract both printed and handwritten text from a DOCX file."""
    printed_text = extract_docx_text(file_content)
    
    if printed_text.strip():  
        return printed_text  # If printed text is found, return it
    
    doc = Document(io.BytesIO(file_content))
    handwritten_text = "\n".join(p.text for p in doc.paragraphs if p.text)
    return handwritten_text

def read_file_content(file, file_type):
    """Read file content based on its type (image, PDF, DOCX)."""
    file_content = file.read()
    if file_type == 'application/pdf':
        try:
            reader = PdfReader(io.BytesIO(file_content))
            text = extract_pdf_text(file_content)
            text += extract_text_from_pdf(file_content)
            return text
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return ""
    elif file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return extract_docx_text(file_content) + extract_text_from_docx(file_content)
    elif file_type in ['image/jpeg', 'image/png']:
        image = Image.open(io.BytesIO(file_content))
        return extract_text_from_handwritten_image(image)
    return file_content.decode("utf-8")

def process_model_files(model_question_paper, model_question_answer_file, file_type):
    """Process model question paper and answer files."""
    model_question_paper_text = read_file_content(model_question_paper, file_type)
    model_content = read_file_content(model_question_answer_file, file_type)
    model_answers = extract_model_data(model_content)
    return model_question_paper_text, model_answers

def process_student_answers(student_answer_file, file_type, model_answers, generated_rubrics, difficulty_level):
    """Process a single student's answers and return grading results."""
    file_name = student_answer_file.filename
    student_content = read_file_content(student_answer_file, 'image/jpeg')
    print(f"Student content: {student_content}")
    student_extracted_answers = extract_student_data(student_content)
    print(f"Student extracted answers: {student_extracted_answers}")

    grading_results = {}
    for question_number, qa in student_extracted_answers['questionAndAnswers'].items():
        student_evaluated_outcome = grade_student_answers_v2(
            model_answers.get(question_number),
            qa['answer'],
            difficulty_level,
            generated_rubrics['question_results'][question_number]['max_score']
        )
        grading_results[question_number] = student_evaluated_outcome

    updated_student_content, total_score, feedbacks = append_grading_results(student_content, grading_results)

    # Generate overall summary
    summary = generate_summary(total_score, generated_rubrics['model_total_score'], get_overall_feedback(feedbacks))
    
    # Combine the grading results with the summary
    updated_student_content += "\n" + summary

    return file_name, updated_student_content

def save_graded_file(updated_content, file_name, file_type):
    """Save graded content to the appropriate file format."""
    if file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        save_as_docx(updated_content, f"{file_name}_graded.docx")
    elif file_type == 'application/pdf':
        save_as_pdf(updated_content, f"{file_name}_graded.pdf")
    else:
        save_as_text(updated_content, f"{file_name}_graded.txt")

def evaluate_student_answers(model_question_paper, model_question_answer_file, student_answer_files, difficulty_level, file_type):
    """Evaluate student answers against model answers and rubrics."""
    model_question_paper_text, model_answers = process_model_files(model_question_paper, model_question_answer_file, file_type)
    print("Generating rubrics in backend...")  
    print(f"Model Question Paper: {model_question_paper_text}")
    generated_rubrics = generate_rubrics(model_question_paper_text)
    print(f"Generated rubrics: {generated_rubrics}")
    answer_evaluated_report = []

    for student_answer_file in student_answer_files:
        file_name, updated_student_content = process_student_answers(
            student_answer_file, file_type, model_answers, generated_rubrics, difficulty_level
        )
        # Save graded file
        save_graded_file(updated_student_content, file_name, file_type)

        # Encode graded content for report
        encoded_content = base64.b64encode(updated_student_content.encode("utf-8")).decode("utf-8")
        answer_evaluated_report.append({
            "student_file": file_name,
            "file": encoded_content
        })

    return answer_evaluated_report
