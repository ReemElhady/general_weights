from datetime import datetime

def parse_datetime_str(datetime_str):
    if not datetime_str:
        return "", ""
    try:
        dt = datetime.fromisoformat(datetime_str)
        return dt.strftime("%Y-%m-%d"), dt.strftime("%H:%M")
    except Exception:
        return datetime_str[:10], datetime_str[11:16]  # fallback

