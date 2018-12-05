import requests
import urllib.parse

from flask import redirect, render_template, request, session
from functools import wraps


def manager_apology(message, code=400):
    return render_template("manager_apology.html", message=message, code=code), code

def employee_apology(message, code=400):
    return render_template("employee_apology.html", message=message, code=code), code


def login_required(f):
    """
    Decorate routes to require login.

    http://flask.pocoo.org/docs/1.0/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

