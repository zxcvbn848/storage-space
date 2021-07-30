import sys
sys.path.append("..")

from flask import request, Blueprint, jsonify, session
from dotenv import load_dotenv
import os
import re

from mysql_connect import selectUser, updateUser

load_dotenv()

api_setting = Blueprint("api_setting", __name__)

@api_setting.route("/setting", methods=["POST"])
def getUser():
   try:
      old_password = request.get_json()["old_password"]
      new_password = request.get_json()["new_password"]
      new_password_confirm = request.get_json()["new_password_confirm"]
      userId = session["user"]["id"]

      passwordRegExp = os.getenv("PASSWORD_PATTERN")

      if not (old_password and new_password and new_password_confirm):
         return jsonify({ "error": True, "message": "Change Falied. All Columns are required." })
      if old_password != selectUser(id = userId)["password"]:
         return jsonify({ "error": True, "message": "Change Falied. Wrong Old Password." })
      if old_password == new_password:
         return jsonify({ "error": True, "message": "Change Falied. New Password must be different from Old one." })
      if new_password != new_password_confirm:
         return jsonify({ "error": True, "message": "Password and Password confirm must be consistent." })
      
      if not (re.match(passwordRegExp, old_password) and re.match(passwordRegExp, new_password) and re.match(passwordRegExp, new_password_confirm)):
         return jsonify({ "error": True, "message": "Change Falied, format of Password is wrong." })
      
      updateUser(userId, password = new_password)

      if selectUser(id = userId)["password"] == new_password:
         return jsonify({ "ok": True, "message": "Change Password Success"})
      else:
         return jsonify({ "error": True, "message": "Change Password Failed. Please Try again." })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "Server Internal Error" })