from pydantic import BaseModel

from .utils import env, log
from .utils.env import EnvVarSpec

logger = log.get_logger(__name__)

#### Types ####

class HttpServerConf(BaseModel):
    host: str
    port: int
    debug: bool
    autoreload: bool

class CouchbaseConf(BaseModel):
    url: str
    bucket: str
    username: str
    password: str
    scope: str = "_default"

#### Env Vars ####

## Logging ##

LOG_LEVEL = EnvVarSpec(id="LOG_LEVEL", default="INFO")

## HTTP ##

HTTP_HOST = EnvVarSpec(id="HTTP_HOST", default="0.0.0.0")

HTTP_PORT = EnvVarSpec(id="HTTP_PORT", default="8000")

HTTP_DEBUG = EnvVarSpec(
    id="HTTP_DEBUG",
    parse=lambda x: x.lower() == "true",
    default="false",
    type=(bool, ...),
)

HTTP_AUTORELOAD = EnvVarSpec(
    id="HTTP_AUTORELOAD",
    parse=lambda x: x.lower() == "true",
    default="false",
    type=(bool, ...),
)

## Opper ##

OPPER_API_KEY = EnvVarSpec(id="OPPER_API_KEY", is_secret=True)

## Couchbase ##

COUCHBASE_BUCKET   = EnvVarSpec(id="COUCHBASE_BUCKET")
COUCHBASE_PASSWORD = EnvVarSpec(id="COUCHBASE_PASSWORD", is_secret=True)
COUCHBASE_SCOPE    = EnvVarSpec(id="COUCHBASE_SCOPE", default="_default")
COUCHBASE_URL      = EnvVarSpec(id="COUCHBASE_URL")
COUCHBASE_USERNAME = EnvVarSpec(id="COUCHBASE_USERNAME")

#### Validation ####

def validate() -> bool:
    return env.validate(
        [
            LOG_LEVEL,
            HTTP_PORT,
            HTTP_DEBUG,
            HTTP_AUTORELOAD,
            OPPER_API_KEY,
            COUCHBASE_URL,
            COUCHBASE_BUCKET,
            COUCHBASE_USERNAME,
            COUCHBASE_PASSWORD,
            COUCHBASE_SCOPE,
        ]
    )

#### Getters ####

def get_log_level() -> str:
    return env.parse(LOG_LEVEL)

def get_http_conf() -> HttpServerConf:
    return HttpServerConf(
        host=env.parse(HTTP_HOST),
        port=env.parse(HTTP_PORT),
        debug=env.parse(HTTP_DEBUG),
        autoreload=env.parse(HTTP_AUTORELOAD),
    )

def get_couchbase_conf() -> CouchbaseConf:
    return CouchbaseConf(
        url=env.parse(COUCHBASE_URL),
        bucket=env.parse(COUCHBASE_BUCKET),
        username=env.parse(COUCHBASE_USERNAME),
        password=env.parse(COUCHBASE_PASSWORD),
    )

def get_opper_api_key() -> str:
    return env.parse(OPPER_API_KEY)


hr_file = """ {
    "employees": [
        {
            "name": "Anders Svensson",
            "age": 35,
            "gender": "male",
            "years_at_company": 5,
            "life_situation": "Married with two young children, needs stable work hours.",
            "schedule_preferences": "Prefers morning shifts, Monday to Friday.",
            "certifications": [
                "forklift",
                "first_aid",
                "packaging_systems"
            ]
        },
        {
            "name": "Lena Karlsson",
            "age": 28,
            "gender": "female",
            "years_at_company": 2,
            "life_situation": "Single, enjoys outdoor activities and flexible work arrangements.",
            "schedule_preferences": "Open to evening and weekend shifts.",
            "certifications": [
                "fire_safety",
                "quality_control"
            ]
        },
        {
            "name": "Erik Lindqvist",
            "age": 42,
            "gender": "male",
            "years_at_company": 10,
            "life_situation": "Divorced, supports elderly parent, requires predictable income.",
            "schedule_preferences": "Wants consistent day shifts.",
            "certifications": [
                "power_tools",
                "forklift",
                "fire_safety",
                "packaging_systems"
            ]
        },
        {
            "name": "Sofia Bergstrom",
            "age": 24,
            "gender": "female",
            "years_at_company": 1,
            "life_situation": "Recently graduated, eager to learn and gain experience.",
            "schedule_preferences": "Available for any shift, keen to gain overtime.",
            "certifications": [
                "first_aid",
                "food_safety"
            ]
        },
        {
            "name": "Johan Nilsson",
            "age": 51,
            "gender": "male",
            "years_at_company": 15,
            "life_situation": "Empty nester, looking for part-time work to supplement retirement savings.",
            "schedule_preferences": "Prefers part-time work, 3 days a week.",
            "certifications": [
                "forklift",
                "fire_safety",
                "packaging_systems",
                "chemical_handling"
            ]
        },
        {
            "name": "Maria Holm",
            "age": 31,
            "gender": "female",
            "years_at_company": 3,
            "life_situation": "Pregnant, requires accommodation for physical limitations.",
            "schedule_preferences": "Needs light duty work and shorter shifts.",
            "certifications": [
                "first_aid",
                "cpr"
            ]
        },
        {
            "name": "Peter Eriksson",
            "age": 48,
            "gender": "male",
            "years_at_company": 7,
            "life_situation": "Has a side business, needs schedule flexibility.",
            "schedule_preferences": "Prefers shifts that don't conflict with his business.",
            "certifications": [
                "power_tools",
                "forklift",
                "boiler_operation"
            ]
        },
        {
            "name": "Anna Jonsson",
            "age": 26,
            "gender": "female",
            "years_at_company": 4,
            "life_situation": "Engaged, saving up for a house.",
            "schedule_preferences": "Wants to work as much as possible, open to overtime.",
            "certifications": [
                "quality_control",
                "packaging_systems",
                "food_safety"
            ]
        },
        {
            "name": "Daniel Gustafsson",
            "age": 39,
            "gender": "male",
            "years_at_company": 6,
            "life_situation": "Single dad, needs to be available for childcare.",
            "schedule_preferences": "Requires consistent schedule, not working late.",
            "certifications": [
                "forklift",
                "first_aid",
                "chemical_handling",
                "confined_space"
            ]
        },
        {
            "name": "Sara Lundberg",
            "age": 29,
            "gender": "female",
            "years_at_company": 2,
            "life_situation": "Recently moved to Stockholm, looking to establish herself.",
            "schedule_preferences": "Available for any shift, interested in learning new skills.",
            "certifications": [
                "first_aid",
                "cpr",
                "food_safety"
            ]
        }
    ],
    "hr_events": [
        {
            "event_type": "incident",
            "event_date": "2024-07-15",
            "event_report": "A pallet of 'Sommar Pilsner' was improperly loaded, leading to a meeting with Anders Svensson, Erik Lindqvist, and the department supervisor. Erik pointed out several violations of standard operating procedure by Anders, who defended himself by claiming he was rushing to meet a deadline. The meeting ended without a clear resolution, but HR was to be informed if not handled properly."
        },
        {
            "event_type": "meeting",
            "event_date": "2024-07-17",
            "event_report": "Maria Holm met with HR to discuss adjustments to her workload due to her pregnancy. A temporary reassignment to quality control was arranged."
        },
        {
            "event_type": "incident",
            "event_date": "2024-07-19",
            "event_report": "Johan Nilsson confronted Peter Eriksson about leaving early on several occasions, suspecting Peter was skipping out to manage his side business. The argument ended with Johan threatening to report Peter to management. Johan did attempt to report Peter but nothing came from it."
        },
        {
            "event_type": "incident",
            "event_date": "2024-07-22",
            "event_report": "Erik Lindqvist reported to the department supervisor that he overheard Sofia Bergstrom confiding in Sara Lundberg about being distracted by a personal phone call while working on the pallet loading incident. Sofia shared this information in confidence."
        },
        {
            "event_type": "other",
            "event_date": "2024-07-29",
            "event_report": "Following the improperly loaded pallet of 'Sommar Pilsner', the department supervisor announced that a new training program on pallet loading and safety procedures would be implemented, led by Erik Lindqvist."
        }
    ],
    "performance_reviews": [
        [
            {
                "event_type": "development_review",
                "event_date": "2020-01-15",
                "event_report": "Anders Svensson's first year has been satisfactory. He is punctual and reliable, especially appreciated given his preference for morning shifts. His forklift certification is a definite asset. There is room for improvement in adhering to all safety protocols; a refresher course is recommended. He interacts well with the team, though he can sometimes be a bit quiet. A good start overall."
            },
            {
                "event_type": "development_review",
                "event_date": "2021-01-15",
                "event_report": "Anders Svensson continues to be a dependable member of the packing and shipping team. His attendance is excellent, and he's always willing to help out where needed. However, there have been some concerns raised regarding the 'Sommar Pilsner' incident, where a pallet was improperly loaded. While the full blame cannot be placed solely on Anders, it highlights a need to reinforce attention to detail and adherence to standard operating procedures, particularly when working under pressure. I recommend that we send Anders on a course to help him deal with stress at work, in order to improve his work. We've also identified a need to ensure clearer communication channels within the team regarding responsibility for final checks. Overall, Anders remains a valuable employee, and this review is intended to provide constructive feedback for continued growth."
            },
            {
                "event_type": "development_review",
                "event_date": "2022-01-15",
                "event_report": "Anders Svensson has shown improvement in adhering to safety protocols this past year. His willingness to address the issues raised last year and participate constructively in the new training program is commendable. He seems to have integrated well back into the team after the 'Sommar Pilsner' incident. His forklift skills are still top-notch, and his First Aid certification is always a plus. One area for future development is taking more initiative to identify and address potential problems before they escalate. Encouraging Anders to voice his concerns and suggestions would benefit the entire team. On a different note, Anders has mentioned childcare challenges, so it would be good to see if any options can be provided for flexibility and help him out. Overall, a solid year for Anders, and we appreciate his continued commitment to Bryggeriet AB."
            }
        ],
        [
            {
                "event_type": "development_review",
                "event_date": "2022-12-20",
                "event_report": "Lena's first year has been largely positive. She is punctual for the most part. Lena is quick to learn the ropes, exemplified by her certifications in fire safety and quality control which she acquired shortly after joining. Her willingness to work evenings and weekends is a great asset to the team. However, there have been some minor instances of her being slightly late to work on occasion, supposedly due to morning runs. We would like to see improved consistency in her punctuality. Overall, Lena is a valuable asset to the packing and shipping department."
            },
            {
                "event_type": "development_review",
                "event_date": "2023-12-15",
                "event_report": "Lena continues to be a reliable member of the team. Her positive attitude and willingness to help colleagues are commendable, as evidenced by her support for Anders after the 'Sommar Pilsner' incident. She showed initiative in figuring out the cause of it, and was forthcoming with the truth. However, there have been a couple of instances where Lena's focus seemed divided, potentially affecting her efficiency. We encourage Lena to prioritize tasks and minimize distractions during work hours. We will provide additional training on time management and task prioritization."
            }
        ],
        [
            {
                "event_type": "development_review",
                "event_date": "2015-12-15",
                "event_report": "Erik has consistently demonstrated a strong understanding of our packaging systems. His forklift and power tool certifications are valuable assets to the team. He is meticulous in his work, ensuring that all procedures are followed correctly. However, Erik needs to improve his communication and teamwork skills. Some team members have expressed that he can be overly critical and not always approachable. He should focus on providing constructive feedback and fostering a more collaborative environment. We will provide Erik with mentorship from Johan, whose experience could benefit Erik."
            },
            {
                "event_type": "development_review",
                "event_date": "2020-12-10",
                "event_report": "Erik continues to be a reliable and knowledgeable member of the packing and shipping department. His certifications and experience are invaluable, especially during peak seasons. He took lead on training new hires during our busy summer months, and the results were good. The pallet incident involving Anders and Sofia has highlighted that Erik is by-the-book and takes procedure seriously, which is much appreciated. However, Erik needs to be aware of the impact his actions have on team morale. Reporting Sofia's private conversation, while technically correct, has created some tension within the team. Next year Erik will receive soft skill training."
            },
            {
                "event_type": "development_review",
                "event_date": "2024-01-10",
                "event_report": "Erik's technical skills and attention to detail remain strong. However, recent feedback indicates ongoing challenges with team dynamics. Some team members perceive him as inflexible and resistant to new ideas. Erik needs to demonstrate a greater willingness to listen to and incorporate suggestions from others. This year, Erik will participate in a conflict resolution workshop and team-building activities. It's crucial that Erik works on building trust and rapport with his colleagues to foster a more positive and productive work environment."
            }
        ],
        [
            {
                "event_type": "development_review",
                "event_date": "2024-07-15",
                "event_report": "Sofia has completed her first year at Bryggeriet AB, and her enthusiasm is commendable. She is always willing to take on extra shifts and learn new tasks, as evidenced by her obtaining certifications in First Aid and Food Safety. However, there have been a few incidents where her eagerness has led to mistakes, particularly with the Sommar Pilsner shipment where she was distracted by a personal call. Erik Lindqvist reported this after overhearing a conversation between Sofia and Sara Lundberg. While her initiative is appreciated, Sofia needs to focus on maintaining concentration and adhering to safety protocols at all times. We will provide her with additional training and mentorship to improve her focus and ensure she understands the importance of following procedures. It is also important to remember that she is new to the job and working hard to learn, she should not be made to feel as though she cannot ask questions when unsure. Further, she should understand that she can come to management with issues that she is struggling with, as opposed to discussing it with a colleague. Sofia has incredible potential but must balance her eagerness with diligence and attention to detail."
            }
        ],
        [
            {
                "event_type": "development_review",
                "event_date": "2010-07-15",
                "event_report": "Johan's performance this year has been satisfactory. He consistently meets expectations in his role as a packaging specialist. His forklift certification is a great asset to the team, and his fire safety training is reassuring. There have been a few instances where his pace has been slower than average, particularly when handling large shipments. We encourage Johan to maintain focus and efficiency. He should maybe consider additional training or refresh his existing qualifications."
            },
            {
                "event_type": "development_review",
                "event_date": "2015-07-15",
                "event_report": "Johan continues to be a reliable member of the team. His knowledge of the packaging systems is invaluable. However, there have been some minor concerns regarding his interactions with newer employees. Johan needs to try to be more supportive of new employees, and avoid unhelpful confrontations as this damages the team morale. His work ethic is generally good, but he sometimes comes across as being somewhat unenthusiastic. We want to see Johan take more initiative in mentoring junior staff and actively participate in team problem-solving."
            },
            {
                "event_type": "development_review",
                "event_date": "2024-07-15",
                "event_report": "Johan has been a long standing member of the team. This is his 15th year at the company. Johan's years of experience are a valuable asset. However, we have received some feedback regarding his recent confrontation with Peter regarding leaving early. Johan needs to trust the management to deal with such cases. Johan is encouraged to focus on his own responsibilities and allow management to address issues of policy violation. We appreciate his dedication but want to see a renewed focus on positive teamwork in the coming year."
            }
        ],
        [
            {
                "event_type": "development_review",
                "event_date": "2022-10-27",
                "event_report": "Maria's first year has been positive. She is reliable and punctual. Her CPR and First Aid certifications have been useful. She is a quick learner and has integrated well into the team. Areas for improvement include taking initiative on tasks without direct supervision. Goal for next year: Develop a deeper understanding of all packing procedures to improve efficiency and to develop her initiative."
            },
            {
                "event_type": "development_review",
                "event_date": "2023-10-27",
                "event_report": "Maria's performance has been satisfactory this year, but there are some concerns. While she consistently performs her assigned tasks, her contribution to team problem-solving has been limited. We encourage her to be more proactive in suggesting solutions and taking ownership of challenges. The recent incident with her needing adjusted work duties due to pregnancy has been accommodated as required. Positive note: Maria's first aid certification was helpful with assisting a coworker who injured himself in the break room. Goal for next year: Focus on improving communication skills and confidence in contributing to team discussions, in addition to continuing to meet the needs associated with her pregnancy."
            },
            {
                "event_type": "development_review",
                "event_date": "2024-10-27",
                "event_report": "Maria's performance this year has been challenging due to her pregnancy and subsequent adjustments to her role. She's been temporarily reassigned to quality control, which has helped with her physical limitations. However, this has led to some resentment from Anna who felt she should've had the opportunity. We've noticed a slight dip in overall morale due to the perceived preferential treatment, and this needs to be addressed. Maria's attendance has been consistent despite her condition, which is commendable. Goal for next year: Develop a plan to ensure a smooth transition back to her regular duties after maternity leave. Explore opportunities for cross-training to alleviate workload imbalances within the team."
            }
        ],
        [
            {
                "event_type": "development_review",
                "event_date": "2017-12-22",
                "event_report": "Peter, your first year has shown promise. Your forklift certification has been a real asset. However, your attendance has been a concern. There have been a few instances where you've arrived late or left early, impacting shift coverage. We appreciate your entrepreneurial spirit but need to ensure it doesn't affect your work here. Focus on improving your punctuality and adhering to the schedule. Let's discuss strategies for better time management in the new year. On a positive note, we are very impressed with your boiler operation skills."
            },
            {
                "event_type": "development_review",
                "event_date": "2020-12-18",
                "event_report": "Peter, your performance this year has been mixed. Your skills with power tools are invaluable, and you consistently deliver on tasks when present. However, the scheduling issues persist. Johan Nilsson reported you for leaving work early several times, although there was no real evidence. We understand you have commitments outside of work, but your adherence to the schedule needs improvement. We need to see a significant change in the coming year. On the positive side your peers enjoy working with you. Perhaps we could explore a more structured work arrangement that suits your personal needs better?"
            },
            {
                "event_type": "development_review",
                "event_date": "2023-12-15",
                "event_report": "Peter, we've seen noticeable improvement in your adherence to the schedule, and we appreciate your efforts. Your forklift skills are still highly valued, especially during peak seasons. However, the events with Johan Nilsson, has affected his desire to work at the company. He has now sent in his retirement papers. This is very problematic. We're going to explore strategies to see if we can come to an agreement that involves you stepping down from the company. It's clear that you are very skilled, but we can no longer deal with the conflict that has been created. I recommend looking for other employment."
            }
        ],
        [
            {
                "event_type": "development_review",
                "event_date": "2021-12-15",
                "event_report": "Anna is a reliable member of the packing team. Her attendance is excellent, and she is always willing to work overtime. Her certifications in Quality Control and Packaging Systems are valuable assets to the company. However, her performance has been somewhat stagnant this year. While she consistently meets expectations, she has not shown significant improvement or taken on new challenges. It's been noted that Anna expressed some frustration regarding Maria Holm's temporary reassignment to quality control, suggesting she feels undervalued. Recommend exploring opportunities for her to utilize her quality control skills in a more challenging role. Also, encourage her to participate in advanced training to further develop her expertise."
            },
            {
                "event_type": "development_review",
                "event_date": "2022-12-15",
                "event_report": "Anna has shown improvement in her performance this year, particularly in her understanding and application of the new packaging systems. Her willingness to cover for colleagues during absences is commendable. However, there are still areas for improvement. Anna needs to work on her communication skills, especially when dealing with challenging situations or differing opinions. There was a minor incident where a mislabeled batch of 'Export Lager' was almost shipped due to Anna's oversight. While she caught the error before it left the warehouse, it highlights the need for increased attention to detail. Suggest Anna attend a workshop on conflict resolution and teamwork."
            },
            {
                "event_type": "development_review",
                "event_date": "2023-12-15",
                "event_report": "Anna's performance this year has been commendable. She consistently demonstrates a strong work ethic and a positive attitude. She has successfully taken on more responsibility within the packing and shipping department, showing a clear willingness to learn and grow. Her quality control skills have been instrumental in reducing errors and improving overall efficiency. She has become a valuable mentor to newer team members, guiding them through complex procedures and sharing her knowledge effectively. Although the Sommar Pilsner incident was a difficult time for the department, Anna has shown a great capacity to put these things behind her, while also learning from them. Anna's initiative and dedication make her a strong candidate for future advancement within the company. Recommend exploring opportunities for her to lead small projects or train new employees on specialized equipment."
            }
        ],
        [
            {
                "event_type": "development_review",
                "event_date": "2019-12-20",
                "event_report": "Daniel's first year has been satisfactory. He quickly learned the ropes in the packing and shipping department. His forklift certification has been invaluable. We appreciate his consistent attendance and reliability, especially given his family commitments. He has expressed concerns about overtime and schedule changes, which we will take into consideration. Areas for improvement include taking more initiative in problem-solving and suggesting improvements to workflow. A good start, but more proactivity is expected in the future."
            },
            {
                "event_type": "development_review",
                "event_date": "2022-12-15",
                "event_report": "Daniel has become a reliable member of the team. His forklift skills are excellent, and his safety record is exemplary. His attendance is consistently good, and he always communicates any childcare-related needs in advance. However, there was a recent incident where he had to leave abruptly, leaving his section understaffed. While understandable, this caused a temporary disruption. We commend Sara Lundberg for covering his duties. Daniel needs to ensure backup plans are in place to minimize such disruptions. Consider further training in advanced logistics or team leadership to broaden his skill set."
            },
            {
                "event_type": "development_review",
                "event_date": "2024-06-20",
                "event_report": "Daniel continues to be a solid performer in the department. His certifications are up-to-date, and he actively participates in safety training. While he's a strong individual contributor, we've noticed he can be hesitant to take on new challenges or leadership roles. We encourage him to step outside his comfort zone and contribute more actively to team projects. Explore opportunities to mentor newer employees and share his expertise. Consider team-building activities to strengthen relationships within the department, particularly after the recent incident involving Daniel's early departure, which was discussed with Sara Lundberg over coffee."
            }
        ],
        [
            {
                "event_type": "development_review",
                "event_date": "2023-07-15",
                "event_report": "Sara has demonstrated a strong willingness to learn and has quickly adapted to the demands of the packing and shipping department. Her certifications in First Aid, CPR, and Food Safety are valuable assets to the team. She has shown flexibility in her schedule and a proactive approach to covering shifts when needed, as seen when Daniel had an emergency. However, there's room for improvement in her understanding of team dynamics and discretion. The incident involving Sofia and the Sommar Pilsner pallet highlights the importance of maintaining confidentiality within the team. While Sara's intention may have been to help, it created some friction. In the coming year, focus on building stronger interpersonal skills and understanding the implications of sharing sensitive information."
            },
            {
                "event_type": "development_review",
                "event_date": "2024-07-15",
                "event_report": "Sara continues to be a reliable member of the packing and shipping team. Her eagerness to learn remains a significant asset, and she has successfully completed additional training on advanced packing techniques. Her flexibility with scheduling is greatly appreciated, especially during peak seasons. While she consistently meets expectations in her core duties, there's been limited initiative in seeking out new responsibilities beyond her assigned tasks. Additionally, there has been some feedback regarding her direct communication style, which can sometimes be perceived as blunt. In the coming year, Sara should focus on exploring opportunities for professional growth within the department and on refining her communication skills to foster more positive working relationships with colleagues."
            }
        ]
    ]
}
"""