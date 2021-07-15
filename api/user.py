import sys
sys.path.append("..")

from flask import request, Blueprint, jsonify, session
from dotenv import load_dotenv
import os
import re

from mysql_connect import selectUser, insertUser

load_dotenv()

api_user = Blueprint("api_user", __name__)

# TBD: verify email

@api_user.route("/user", methods=["GET"])
def getUser():
   if "user" in session:
      data = {
         "id": session["user"]["id"],
         "name": session["user"]["name"],
         "email": session["user"]["email"]
      }
      return jsonify({ "data": data })
   else:
      return jsonify({ "data": None })

@api_user.route("/user", methods=["POST"])
def postUser():
   try:
      name = request.get_json()["name"]
      email = request.get_json()["email"]
      password = request.get_json()["password"]
      passwordCheck = request.get_json()["password_check"]

      emailRegExp = os.getenv("EMAIL_PATTERN")
      passwordRegExp = os.getenv("PASSWORD_PATTERN")

      if password != passwordCheck:
         return jsonify({ "error": True, "message": "Password and Password Check must be consistent." })
      if not (name and email and password and passwordCheck):
         return jsonify({ "error": True, "message": "Sign Up Falied. Name, Email, and Password are required." })
      
      if not (re.match(passwordRegExp, password) and re.match(emailRegExp, email)):
         return jsonify({ "error": True, "message": "Sign Up Falied, format of Email or Password is wrong." })

      userVerified = selectUser(email = email)
      if userVerified:
         return jsonify({ "error": True, "message": "Sign Up Falied, Email have been used or other reason" })

      insertUser(name = name, email = email, password = password)
      updatedUser = selectUser(email = email, password = password)
      if updatedUser:
         return jsonify({ "ok": True })
      else:
         return jsonify({ "error": True, "message": "Sign Up Falied, Email have been used or other reason" })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "Server Internal Error" })

@api_user.route("/user", methods=["PATCH"])
def patchUser():
   try:
      email = request.get_json()["email"]
      password = request.get_json()["password"]

      if not (email and password):
         return jsonify({ "error": True, "message": "Sign In Falied. Email, and Password are required." })

      emailRegExp = os.getenv("EMAIL_PATTERN")
      passwordRegExp = os.getenv("PASSWORD_PATTERN")

      if not (re.match(passwordRegExp, password) and re.match(emailRegExp, email)):
         return jsonify({ "error": True, "message": "Sign In Falied, format of Email or Password is wrong." })

      user = selectUser(email = email, password = password)

      if user:
         session["user"] = {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
         }
         return jsonify({ "ok": True })
      else:
         return jsonify({ "error": True, "message": "Sign In Falied, Email or Password is wrong or other reason." })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "Server Internal Error" })

@api_user.route("/user", methods=["DELETE"])
def deleteUser():
   try:
      session.clear()
      if "user" not in session:
         return jsonify({ "ok": True })
      else: 
         return jsonify({ "error": True, "message": "Sign Out Failed" })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "Server Internal Error" })