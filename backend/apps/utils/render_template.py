from jinja2 import Template
from django.utils.safestring import mark_safe

def render_ticket_with_template(ticket, template_code: str):
    template = Template(template_code)
    html = template.render(object=ticket)
    return mark_safe(html)

def render_template(template_code: str, context: dict) -> str:
    template = Template(template_code)
    return template.render(context)