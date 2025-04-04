from typing import List, Optional
from pydantic import BaseModel, Field
from google import genai
from dotenv import load_dotenv
from api.src.api.models import EmployeeInput, HrEvent
from pprint import pprint
import json
import os

# Load environment variables
load_dotenv()

# Configure Gemini API
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))


def describe_employee(employee: EmployeeInput) -> str:
    return f"""
    Name: {employee.name}
    Age: {employee.age}
    Gender: {employee.gender}
    Years at Company: {employee.years_at_company}
    Life Situation: {employee.life_situation}
    Schedule Preferences: {employee.schedule_preferences}
    Certifications: {', '.join(str(cert) for cert in employee.certifications)}
    """


def hr_event_pregeneration(employees: List[EmployeeInput]) -> str:
    prompt = f"""
    These are some of the employees at a company. Please describe in plain text what kind of HR events may have happened to these employees.
    These events could be anything from a meeting to an incident. Feel free to be creative and write prosaically rather than in a list format.
    {'\n\n'.join([describe_employee(employee) for employee in employees])}
    """
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt
    )
    return response.text


def generate_hr_events(prompt: str) -> List[HrEvent]:
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'event_type': {'type': 'string',
                                       'enum': ['meeting', 'development_review', 'incident', 'other']},
                        'event_date': {'type': 'string'},
                        'event_report': {'type': 'string'},
                        'event_metadata': {'type': 'object', 'additionalProperties': True}
                    },
                    'required': ['event_type', 'event_date', 'event_report']
                }
            }
        },
    )
    return [HrEvent.model_validate(event) for event in response.parsed]


def generate_performance_review(employee: EmployeeInput) -> List[HrEvent]:
    prompt = f"""
    Please generate performance reviews for the following employee. 
    Make one for each year they have been working at the company.
    Maximum 3 reviews in total though.

    {describe_employee(employee)}
    """
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'event_type': {'type': 'string',
                                       'enum': ['meeting', 'development_review', 'incident', 'other']},
                        'event_date': {'type': 'string'},
                        'event_report': {'type': 'string'},
                        'event_metadata': {'type': 'object', 'additionalProperties': True}
                    },
                    'required': ['event_type', 'event_date', 'event_report']
                }
            }
        },
    )
    return [HrEvent.model_validate(event) for event in response.parsed]


def generate_employee_data(n: int = 3) -> list[EmployeeInput]:
    prompt = f"""
    Generate data for {n} employees working in a construction company.
    Include diverse skills, experience levels, and personal information.
    """
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': list[EmployeeInput],
        },
    )

    return response.parsed


if __name__ == "__main__":
    employees = generate_employee_data(2)
    print("\n\nGenerated Employees:")
    for employee in employees:
        print(json.dumps(employee.model_dump(mode='json'), indent=2))

    hr_event_prompt = hr_event_pregeneration(employees)
    print("\n\nHR Event Prompt:")
    print(hr_event_prompt)

    performance_reviews = [generate_performance_review(employee) for employee in employees]
    print("\n\nGenerated Performance Reviews:")
    for review in performance_reviews:
        print(json.dumps(review.model_dump(mode='json'), indent=2))

    hr_events = generate_hr_events(hr_event_prompt)
    print("\n\nGenerated HR Events:")
    for event in hr_events:
        print(json.dumps(event.model_dump(mode='json'), indent=2))
