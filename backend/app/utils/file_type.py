from io import BytesIO
from PyPDF2 import PdfReader
from fpdf import FPDF
from docx import Document
import re

def save_as_docx(content, file_name):
    """
    Saves content as a DOCX file with grading results.
    """
    doc = Document()
    # Split the content into lines for adding to the doc
    lines = content.split("\n")
    for line in lines:
        doc.add_paragraph(line)
    # Save the document
    doc.save(file_name)


def extract_model_data(file_content):
    """
    Extracts questions and answers from the model Q&A file content.
    """
    model_data = {}
    question_pattern = r"(\d+)\.\s*(.*?)\nAnswer:(.*?)(?=\n\d+\.|$)"
    matches = re.findall(question_pattern, file_content, re.DOTALL)

    for question_number, question_text, answer_text in matches:
        model_data[question_number.strip()] = answer_text.strip()
    return model_data


def extract_student_data(text: str):
    student_data = {}
    questions_and_answers = {}
    question_pattern = r"(\d+)\.\s*(.*?)\nAnswer:(.*?)(?=\n\d+\.|$)"
    matches = re.findall(question_pattern, text, re.DOTALL)

    for question_number, question_text, answer_text in matches:
        questions_and_answers[question_number] = {
            "question": question_text.strip(),
            "answer": answer_text.strip()
        }
    student_data['questionAndAnswers'] = questions_and_answers
    return student_data


def append_grading_results(student_content, grading_results):
    """
    Appends grading results to the student content after each question and answer.
    """
    updated_text = ""
    question_pattern = r"(\d+)\.\s*(.*?)\nAnswer:(.*?)(?=\n\d+\.|$)"
    last_pos = 0
    total_score = 0
    feedbacks = []
    for match in re.finditer(question_pattern, student_content, re.DOTALL):
        question_number, question_text, answer_text = match.groups()
        start, end = match.span()

        # Add original content before the current question
        updated_text += student_content[last_pos:start]
        last_pos = end

        # Append the question, answer, and grading results
        updated_text += f"{question_number}. {question_text}\n"
        updated_text += f"Answer: {answer_text}\n"
        
        # Grading Results for the current question
        grading_result = grading_results.get(question_number, {})
        total_score  += grading_result.get('score_achieved', 0)
        updated_text += f"Score: {grading_result.get('score_achieved', 0)}/{grading_result.get('maximum_score', 0)}\n"
        updated_text += f"Justification: {grading_result.get('justification', 'N/A')}\n"
        updated_text += f"Feedback: {grading_result.get('feedback', 'No feedback provided')}\n"
        feedbacks.append(grading_result.get('feedback', ''))


    # Add any remaining content after the last question
    updated_text += student_content[last_pos:]
    
    return updated_text, total_score, feedbacks

def extract_pdf_text(pdf_content):
    """
    Extracts text from a PDF file.
    """
    reader = PdfReader(BytesIO(pdf_content))
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


def extract_docx_text(docx_content):
    """
    Extracts text from a DOCX file, including generic numbers from numbered lists and excluding bullet points.
    """
    try:
        # Wrap binary content in a BytesIO object to mimic a file-like object
        doc = Document(BytesIO(docx_content))
        text = []
        numbering_dict = {}

        # Iterate through each paragraph in the document
        for para in doc.paragraphs:
            # Extract the numbering (if present) using the XML
            p_xml = para._element
            numbering = get_generic_numbering_from_xml(p_xml)
            
            # Check if the paragraph has numbering (e.g., in a numbered list)
            if numbering:
                # Check if the paragraph has numbering, and add the number
                if numbering not in numbering_dict:
                    numbering_dict[numbering] = 1
                else:
                    numbering_dict[numbering] += 1
                
                # Add the numbering and the paragraph text
                text.append(f"{numbering_dict[numbering]}. {para.text}")
            else:
                # If no numbering, just add the plain text
                text.append(para.text)

        # Return the cleaned-up text, joining all paragraphs with newlines
        return "\n".join(text).strip()
    
    except Exception as e:
        print(f"Error reading DOCX content: {e}")
        return ""

def get_generic_numbering_from_xml(paragraph_xml):
    """
    Extracts generic numbering information from a paragraph's XML element if available.
    """
    try:
        # Define namespaces for XML parsing
        namespaces = {
            'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        }
        
        # Get the numbering properties from the paragraph XML element
        num_pr = paragraph_xml.find('.//w:numPr', namespaces)
        
        if num_pr is not None:
            num_id = num_pr.find('.//w:numId', namespaces)
            if num_id is not None:
                num_val = num_id.attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val')
                return num_val  # This returns the number ID used in the document (this is the reference ID)
        return None
    except Exception as e:
        print(f"Error extracting numbering: {e}")
        return None

def save_as_text(content, file_name):
    """
    Saves content as a plain text file.
    """
    with open(file_name, "w", encoding="utf-8") as f:
        f.write(content)


def save_as_pdf(content, file_name):
    """
    Saves content as a PDF file with retained font and color.
    """
    pdf = FPDF()
    pdf.add_page()

    # Set font (change to your desired font and size)
    pdf.set_font("Arial", size=12)  # You can adjust this

    # Set text color (e.g., RGB for red, blue, etc.)
    pdf.set_text_color(0, 0, 0)  # Black color

    # Split the content into lines for multi-cell format
    lines = content.split("\n")
    
    # Add each line to the PDF, retaining formatting
    for line in lines:
        pdf.multi_cell(0, 10, line)
    
    # Output PDF to file
    pdf.output(file_name)
    
def generate_summary(total_score, max_possible_score):
    percentage = (total_score / max_possible_score) * 100
    grade = assign_grade(percentage)
    return f"Summary:\nTotal Score: {total_score}\nPercentage: {percentage:.2f}%\nGrade: {grade}"

def assign_grade(percentage):
    if percentage >= 90:
        return 'A'
    elif percentage >= 80:
        return 'B'
    elif percentage >= 70:
        return 'C'
    elif percentage >= 60:
        return 'D'
    else:
        return 'F'