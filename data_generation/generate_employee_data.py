from typing import List
from google import genai
from dotenv import load_dotenv

from api.src.api.main import load_generated_data
from api.src.api.models import EmployeeInput, HrEvent
import json
import os

# Load environment variables
load_dotenv()

# Configure Gemini API
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
model = 'gemini-2.0-flash'

system_prompt = """
The following will entail a brewing company called "Bryggeriet AB", located in Stockholm, Sweden.
The company is a medium sized brewery that produces a variety of beers.
All the employees mentioned work at the company within the same department, which is the packing and shipping department.
"""


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
    {system_prompt}

    These are some of the employees at a company. Please describe in plain text what kind of HR events may have happened to these employees.
    These events could be anything from a meeting to an incident. Feel free to be creative and write prosaically rather than in a list format.
    Do not write any performance reviews! That will be done by another agent. Please make sure there are some conflicts recorded in the events.
    
    Feel free to include some more mundane every day events that could have happened but don't require HR intervention.
    This last part is for making sure we get to know the employees better.

    Make your answer as long as you want, though longer is better. 

    {'\n\n'.join([describe_employee(employee) for employee in employees])}
    """
    response = client.models.generate_content(
        model=model,
        contents=prompt
    )
    return response.text


def generate_hr_events(prompt: str) -> List[HrEvent]:
    prompt = f"""
    {system_prompt}

    Do note that only events that may have required HR intervention should be included.

    {prompt}
    """
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': list[HrEvent]
        },
    )
    return response.parsed


def generate_performance_review(employee: EmployeeInput, history: str) -> List[HrEvent]:
    prompt = f"""
    {system_prompt}

    Please generate performance reviews for the following employee. 
    Make one for each year they have been working at the company. Make sure that it is not always positive. Maximum 3 reviews in total though.
    Also make sure that they are eventful and that you can see that there are actual people behind the employee and employer.

    {describe_employee(employee)}


    {history}
    """
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': list[HrEvent]
        },
    )
    return response.parsed


def generate_employee_data(n: int = 3) -> list[EmployeeInput]:
    prompt = f"""
    {system_prompt}

    Generate data for {n} employees working in a brewery.
    Include diverse skills, experience levels, and personal information. Use Swedish sounding names, but only use ASCII characters.
    """
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': list[EmployeeInput],
        },
    )

    return response.parsed


if __name__ == "__main__":
    employees = generate_employee_data(10)
    print("\n\nGenerated Employees:")
    for employee in employees:
        print(json.dumps(employee.model_dump(mode='json'), indent=2))

    hr_event_prompt = hr_event_pregeneration(employees)
    print("\n\nHR Event Prompt:")
    print(hr_event_prompt)

    hr_events = generate_hr_events(hr_event_prompt)
    print("\n\nGenerated HR Events:")
    for event in hr_events:
        print(json.dumps(event.model_dump(mode='json'), indent=2))

    performance_reviews = [generate_performance_review(employee, hr_event_prompt) for employee in employees]
    print("\n\nGenerated Performance Reviews:")
    for employee_reviews in performance_reviews:
        for review in employee_reviews:
            print(json.dumps(review.model_dump(mode='json'), indent=2))

    # Save the generated data to a file
    with open('generated_data.json', 'w') as f:
        json.dump({
            'employees': [employee.model_dump(mode='json') for employee in employees],
            'hr_events': [event.model_dump(mode='json') for event in hr_events],
            'performance_reviews': [[review.model_dump(mode='json') for review in reviews] for reviews in performance_reviews]
        }, f, indent=2)

    print("\n\nData saved to generated_data.json")

    # Test that loaded data matches original data
    loaded_employees, loaded_hr_events, loaded_performance_reviews = load_generated_data()
    
    # Compare employees
    assert len(loaded_employees) == len(employees), "Number of employees doesn't match"
    for orig, loaded in zip(employees, loaded_employees):
        assert orig.model_dump(mode='json') == loaded.model_dump(mode='json'), "Employee data doesn't match"
        
    # Compare HR events
    assert len(loaded_hr_events) == len(hr_events), "Number of HR events doesn't match"
    for orig, loaded in zip(hr_events, loaded_hr_events):
        assert orig.model_dump(mode='json') == loaded.model_dump(mode='json'), "HR event data doesn't match"
        
    # Compare performance reviews
    assert len(loaded_performance_reviews) == len(performance_reviews), "Number of performance review sets doesn't match"
    for orig_set, loaded_set in zip(performance_reviews, loaded_performance_reviews):
        assert len(orig_set) == len(loaded_set), "Number of reviews per employee doesn't match"
        for orig, loaded in zip(orig_set, loaded_set):
            assert orig.model_dump(mode='json') == loaded.model_dump(mode='json'), "Performance review data doesn't match"
            
    print("\nVerified: Loaded data matches original data")