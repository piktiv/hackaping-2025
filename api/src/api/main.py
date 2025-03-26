from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from opperai import Opper
from datetime import datetime, timedelta

from .clients.scheduling import SchedulingClient
from .routes import router
from .utils import log
from . import conf

log.init(conf.get_log_level())
logger = log.get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    cb_conf = conf.get_couchbase_conf()
    app.state.db = SchedulingClient(
        url=cb_conf.url,
        username=cb_conf.username,
        password=cb_conf.password,
        bucket_name=cb_conf.bucket,
        scope=cb_conf.scope
    )
    try:
        app.state.db.connect()
        logger.info("Connected to Couchbase database")

    except Exception:
        logger.warning("Couldn't connect to Couchbase - retrying on next request.")

    init_default_data(app.state.db)
    app.state.opper = Opper(api_key=conf.get_opper_api_key())

    yield

def init_default_data(db: SchedulingClient):
    """Initialize default employees and schedules for demo purposes."""
    # Check if we already have employees
    employees = db.get_employees()

    if not employees:
        logger.info("Initializing default employees and schedules...")

        # Create default employees
        default_employees = [
            {"name": "John Smith", "employee_number": "EMP001", "known_absences": [(datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")]},
            {"name": "Sarah Johnson", "employee_number": "EMP002", "known_absences": [(datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")]},
            {"name": "Michael Chen", "employee_number": "EMP003", "known_absences": []},
            {"name": "Emily Davis", "employee_number": "EMP004", "known_absences": [(datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d")]},
            {"name": "David Wilson", "employee_number": "EMP005", "known_absences": []}
        ]

        for emp in default_employees:
            try:
                db.create_employee(
                    name=emp["name"],
                    employee_number=emp["employee_number"],
                    known_absences=emp["known_absences"]
                )
                logger.info(f"Created default employee: {emp['name']}")
            except Exception as e:
                logger.warning(f"Failed to create employee {emp['name']}: {str(e)}")

        # Create default schedules for the next 7 days
        today = datetime.now().date()
        for i in range(7):
            day = today + timedelta(days=i)
            date_str = day.strftime("%Y-%m-%d")
            emp_number = default_employees[i % len(default_employees)]["employee_number"]

            try:
                db.create_schedule(date_str=date_str, employee_number=emp_number)
                logger.info(f"Created schedule for {date_str}")
            except Exception as e:
                logger.warning(f"Failed to create schedule for {date_str}: {str(e)}")
    else:
        logger.info(f"Found {len(employees)} existing employees, skipping initialization")

app = FastAPI(
    title="Employee Scheduling API",
    version="1.0.0",
    docs_url="/docs",
    lifespan=lifespan
)
app.include_router(router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def main():
    if not conf.validate():
        raise ValueError("Invalid configuration.")

    http_conf = conf.get_http_conf()
    logger.info(f"Starting API on port {http_conf.port}")
    uvicorn.run(
        "api.main:app",
        host=http_conf.host,
        port=http_conf.port,
        reload=http_conf.autoreload,
        log_level="debug" if http_conf.debug else "info",
        log_config=None
    )
