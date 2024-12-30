class StudentAnswer:
    def __init__(self, file_stream):
        self.file_stream = file_stream
        self.student_name = None
        self.questions_answers = {}

    def parse(self):
        question = None
        for line in self.file_stream:
            line = line.decode('utf-8').strip()
            if line.startswith('Student Name:'):
                self.student_name = line.split(':', 1)[1].strip()
            elif line and line[0].isdigit():
                question = line
                self.questions_answers[question] = ""
            elif question:
                self.questions_answers[question] += line + " "