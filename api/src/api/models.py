from enum import Enum
from pydantic import BaseModel, Field
from typing import Any
from uuid import UUID
from datetime import datetime
from textwrap import dedent


class ScheduleChange(BaseModel):
    employee_name: str = Field(description="The name of the employee originally scheduled for the date")
    target_date: str = Field(description="The date of the requested change in YYYY-MM-DD format")
    suggested_replacement: str = Field(description="The suggested replacement employee, if any")

# Schedule Change Request Analysis
class ScheduleChangeAnalysis(BaseModel):
    thoughts: str = Field(description="The AI's thought process while analyzing the request")
    original_query: str = Field(description="The original query text that was analyzed")
    changes: list[ScheduleChange] = Field(description="The suggested changes to the schedule")
    reason: str | None = Field(description="The extracted reason for the change")
    recommendation: str = Field(
        description="Whether the change should be approved, denied, or needs discussion",
        enum=["approve", "deny", "discuss"]
    )
    reasoning: str = Field(description="Detailed explanation for the recommendation")


# Shift Model
class Shift(BaseModel):
    shift_id: str
    start: str # start of shift
    end: str # end of shift
    type: str # Type of shift (cleaning, line 1, line2 etc...)
    employee_number: str # Reference to Employee number
    score: float # How happy the employee is with this scheduling

# Schedule Model
class Schedule(BaseModel):
    date: str  # ISO format date
    first_line_support: str  # Employee number


# Rules Model
class Rules(BaseModel):
    max_days_per_week: int = 3  # Maximum consecutive days as first line support
    preferred_balance: float = 0.2  # Preferred maximum difference from average (20%)


# Employee Model
class EmployeeInput(BaseModel):
    name: str
    age: int
    gender: str = Field(description="Gender of the employee", enum=['male', 'female', 'non_binary', 'other'])
    years_at_company: int
    life_situation: str = Field(description="A description of the employee's life situation")
    schedule_preferences: str = Field(description="A description of the employee's schedule preferences")
    certifications: list[str] = Field(
        default_factory=list,
        description="List of employee certifications",
        enum=[
            "power_tools",
            "forklift",
            "fire_safety",
            "first_aid",
            "cpr",
            "brewing_certification",
            "food_safety",
            "quality_control",
            "packaging_systems",
            "chemical_handling",
            "confined_space",
            "boiler_operation"
        ]
    )


# HR Event Model
class HrEvent(BaseModel):
    event_type: str = Field(description="The type of HR event", enum=['meeting', 'development_review', 'incident', 'other'])
    event_date: str = Field(description="The date of the event in YYYY-MM-DD format")
    event_report: str = Field(description="Summary of notes or event details")


class GroundEmployee(EmployeeInput):
    scheduled_shifts: list[Schedule] = Field(default_factory=list)
    historical_shifts: list[Schedule] = Field(default_factory=list)
    hr_events: list[HrEvent] = Field(default_factory=list)
    known_absences: list[str] = Field(default_factory=list)  # ISO format dates
    metadata: dict[str, Any] = Field(default_factory=dict)


class Employee(GroundEmployee):
    employee_number: str

class FrontendEmployee(BaseModel):
    employee_number: str
    name: str

# API Request/Response Models
class MessageResponse(BaseModel):
    message: str


class ScheduleChangeRequest(BaseModel):
    request_text: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class ScheduleChangeResponse(BaseModel):
    request: str
    analysis: ScheduleChangeAnalysis


class EmployeeCreateRequest(BaseModel):
    name: str
    employee_number: str
    known_absences: list[str] = Field(default_factory=list)  # ISO format dates
    metadata: dict[str, Any] = Field(default_factory=dict)


class ScheduleCreateRequest(BaseModel):
    date: str  # ISO format date
    first_line_support: str  # Employee number


class RulesUpdateRequest(BaseModel):
    max_days_per_week: int | None = None
    preferred_balance: float | None = None

class ShiftCreateRequest(BaseModel):
    employee_number: str
    start: str
    end: str
    type: str

class ShiftUpdateRequest(BaseModel):
    request_text: str
    metadata: dict[str, Any] = Field(default_factory=dict)

class ShiftReview(BaseModel):
    reasoning: str = Field(description="introspective reasoning about what to write")
    comments: str = Field(
        description=dedent("""
        Free form comments about the shift, who might be unsatisfied, who might be happy, who might be struggling, etc.
        Do suggest changes to the schedule if possible. You may also, very creatively, suggest things that may improve employee morale due to grievances.
        Only include comments about employees that are actually scheduled.
        """
        )
    )
    employee_satisfaction: dict[str, float] = Field(
        description="Employee name as key, satisfaction level between 0 and 1 as value, only include employees that are actually scheduled"
    )
    shift_quality: str = Field(
        description="How good is the shift scheduling overall?",
        enum=["excellent", "good", "fair", "poor"]
    )
