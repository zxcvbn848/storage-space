import sys
sys.path.append("..")

from google.oauth2 import id_token
from google.auth.transport import requests

from flask import request, Blueprint, jsonify, session
from dotenv import load_dotenv
import os, re

from mysql_connect import selectUser, insertUser
from use_bcrypt import *

load_dotenv()

GOOGLE_OAUTH2_CLIENT_ID = os.getenv("GOOGLE_OAUTH2_CLIENT_ID")

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

      if not (name and email and password and passwordCheck):
         return jsonify({ "error": True, "message": "Sign Up Falied. Name, Email, and Password are required." })
      if password != passwordCheck:
         return jsonify({ "error": True, "message": "Password and Password Check must be consistent." })
      
      if not (re.match(passwordRegExp, password) and re.match(emailRegExp, email)):
         return jsonify({ "error": True, "message": "Sign Up Falied, format of Email or Password is wrong." })

      userVerified = selectUser(email = email, provider = "local")
      if userVerified:
         return jsonify({ "error": True, "message": "Sign Up Falied, Email have been used or other reason" })

      # Hash and Salt Password
      hashedPassword = hashPassword.hashSalt(password)

      insertUser(name = name, email = email, password = hashedPassword, provider = "local")
      updatedUser = selectUser(email = email, password = hashedPassword, provider = "local")
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

      user = selectUser(email = email, provider = "local")
      if user:
         userHashPassword = user["password"]
         # Check Password
         if hashPassword.hashSaltCheck(password, userHashPassword):
            session["user"] = {
               "id": user["id"],
               "name": user["name"],
               "email": user["email"]
            }
            return jsonify({ "ok": True })
         else:
            return jsonify({ "error": True, "message": "Sign In Falied, Email or Password is wrong or other reason." })
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

@api_user.route("/oauth", methods=["PATCH"])
def oauth():
   token = request.get_json()['id_token']
   try:
      # Specify the GOOGLE_OAUTH2_CLIENT_ID of the app that accesses the backend:
      id_info = id_token.verify_oauth2_token(
         token,
         requests.Request(),
         GOOGLE_OAUTH2_CLIENT_ID
      )

      if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
         raise ValueError('Wrong issuer.')

   except ValueError:
      # Invalid token
      raise ValueError('Invalid token')

   name = id_info["name"]
   email = id_info["email"]

   signedUpUser = selectUser(email = email, provider = "google")
   if signedUpUser:
      session["user"] = {
         "id": signedUpUser["id"],
         "name": signedUpUser["name"],
         "email": signedUpUser["email"]
      }
      return jsonify({ "ok": True })

   insertUser(name = name, email = email, provider = "google")
   user = selectUser(email = email, provider = "google")

   if user:
      session["user"] = {
         "id": user["id"],
         "name": user["name"],
         "email": user["email"]
      }
      return jsonify({ "ok": True })
   else:
      return jsonify({ "error": True, "message": "Sign In Falied, Email or Password is wrong or other reason." })