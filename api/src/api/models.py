from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal, Any
from datetime import date


# Schedule Change Request Analysis
class ScheduleChangeAnalysis(BaseModel):
    thoughts: str = Field(description="The AI's thought process while analyzing the request")
    original_query: str = Field(description="The original query text that was analyzed")
    employee_name: Optional[str] = Field(description="The name of the employee requesting the change")
    target_date: Optional[str] = Field(description="The date of the requested change in YYYY-MM-DD format")
    reason: Optional[str] = Field(description="The extracted reason for the change")
    suggested_replacement: Optional[str] = Field(description="The suggested replacement employee, if any")
    recommendation: str = Field(
        description="Whether the change should be approved, denied, or needs discussion",
        enum=["approve", "deny", "discuss"]
    )
    reasoning: str = Field(description="Detailed explanation for the recommendation")


# Employee Model
class Employee(BaseModel):
    name: str
    employee_number: str
    first_line_support_count: int = 0
    known_absences: List[str] = Field(default_factory=list)  # ISO format dates
    metadata: Dict[str, Any] = Field(default_factory=dict)


# Schedule Model
class Schedule(BaseModel):
    date: str  # ISO format date
    first_line_support: str  # Employee number


# Rules Model
class Rules(BaseModel):
    max_days_per_week: int = 3  # Maximum consecutive days as first line support
    preferred_balance: float = 0.2  # Preferred maximum difference from average (20%)


# API Request/Response Models
class MessageResponse(BaseModel):
    message: str


class ScheduleChangeRequest(BaseModel):
    request_text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ScheduleChangeResponse(BaseModel):
    request: str
    analysis: ScheduleChangeAnalysis


class EmployeeCreateRequest(BaseModel):
    name: str
    employee_number: str
    known_absences: List[str] = Field(default_factory=list)  # ISO format dates
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ScheduleCreateRequest(BaseModel):
    date: str  # ISO format date
    first_line_support: str  # Employee number


class RulesUpdateRequest(BaseModel):
    max_days_per_week: Optional[int] = None
    preferred_balance: Optional[float] = None