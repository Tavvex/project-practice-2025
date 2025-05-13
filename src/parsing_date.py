import dateparser
from datetime import datetime
from zoneinfo import ZoneInfo
def parse_date(text: str) -> datetime:
    settings = {
        'PREFER_DATES_FROM': 'future',  # Только будущие даты
        'TIMEZONE': 'UTC+3'
    }
    parsed = dateparser.parse(text, settings=settings)
    if not parsed:
        raise ValueError("Не могу распознать дату :(")
    return parsed

def convertToMoscowTime(time: datetime)->datetime:
    return time.astimezone(ZoneInfo("Europe/Moscow"))
