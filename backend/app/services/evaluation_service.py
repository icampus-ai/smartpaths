import base64
from io import BytesIO
from PyPDF2 import PdfReader
from fpdf import FPDF
from docx import Document
import re
from ai_model.model.grading_system.grader import grade_student_answers

def evaluate_student_answers(model_question_answer_file, student_answer_files, file_type='text/plain', output_format='text'):
    """
    Evaluates student answers against a model answer file and saves results in the specified format.

    Args:
        model_question_answer_file: A file-like object containing model answers.
        student_answer_files: A list of file-like objects containing student answers.
        file_type: The type of the input files ('text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document').
        output_format: The format of the output ('text', 'pdf', 'docx').

    Returns:
        A list of dictionaries containing evaluated student files in base64 format.
    """
    # Extract model answers
    if file_type == 'application/pdf':
        model_content = extract_pdf_text(model_question_answer_file.read())
    elif file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        model_content = extract_docx_text(model_question_answer_file.read())
        print("Model content:", model_content)
    else:
        model_content = model_question_answer_file.read().decode("utf-8")
    model_answers = extract_model_data(model_content)

    answer_evaluated_report = []

    for student_answer_file in student_answer_files:
        file_name = student_answer_file.filename
        if file_type == 'application/pdf':
            student_content = extract_pdf_text(student_answer_file.read())
        elif file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            student_content = extract_docx_text(student_answer_file.read())
        else:
            student_content = student_answer_file.read().decode("utf-8")

        # Extract student metadata and questions/answers
        student_extracted_answers = extract_student_data(student_content)
        grading_results = {}

        # Grade each answer
        for question_number, qa in student_extracted_answers['questionAndAnswers'].items():
            print(f"Grading answer for question {question_number}...")
            print(f"Model answer: {model_answers.get(question_number)}")
            print(f"Student answer: {qa['answer']}")
            result = grade_student_answers(model_answers.get(question_number), qa['answer'], difficulty_level="medium")
            grading_results[question_number] = result

        # Append grading results to the student's original content
        updated_student_content = append_grading_results(student_content, grading_results)
        print("Updated student content with grading results:", updated_student_content)
        
        # Save in the specified format
        if output_format == 'text':
            save_as_text(updated_student_content, f"{file_name}_graded.txt")
        elif output_format == 'pdf':
            save_as_pdf(updated_student_content, f"{file_name}_graded.pdf")
        elif output_format == 'docx':
            save_as_docx(updated_student_content, f"{file_name}_graded.docx")

        print(f"Grading results for {file_name}:" )
        encoded_content = base64.b64encode(updated_student_content.encode("utf-8")).decode('utf-8')
        
        answer_evaluated_report.append({
            "student_file": file_name,
            "file": encoded_content
        })

    return answer_evaluated_report


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
        updated_text += f"Final Score: {grading_result.get('final_score', 0)}/4\n"
        updated_text += f"Max Score: {grading_result.get('max_score', 0)}\n"
        updated_text += f"Feedback: {grading_result.get('feedback', 'No feedback provided')}\n"
        updated_text += f"Percentage: {grading_result.get('percentage', 0)}%\n"
        updated_text += f"Justification: {grading_result.get('justification', 'N/A')}\n"

    # Add any remaining content after the last question
    updated_text += student_content[last_pos:]
    
    print("Updated student content with grading results:", updated_text)
    return updated_text


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
