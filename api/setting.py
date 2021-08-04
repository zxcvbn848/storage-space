import sys
sys.path.append("..")

from flask import request, Blueprint, jsonify, session
from dotenv import load_dotenv
import os
import re

from mysql_connect import *

load_dotenv()

api_setting = Blueprint("api_setting", __name__)

@api_setting.route("/ps", methods=["POST"])
def postPs():
   try:
      if "user" not in session:
         return jsonify({ "error": True, "message": "Please sign in first." })

      old_password = request.get_json()["old_password"]
      new_password = request.get_json()["new_password"]
      new_password_confirm = request.get_json()["new_password_confirm"]
      userId = session["user"]["id"]

      passwordRegExp = os.getenv("PASSWORD_PATTERN")

      if not (old_password and new_password and new_password_confirm):
         return jsonify({ "error": True, "message": "Change Falied. All Columns are required." })
      if old_password != selectUser(id = userId, provider = "local")["password"]:
         return jsonify({ "error": True, "message": "Change Falied. Wrong Old Password." })
      if old_password == new_password:
         return jsonify({ "error": True, "message": "Change Falied. New Password must be different from Old one." })
      if new_password != new_password_confirm:
         return jsonify({ "error": True, "message": "Password and Password confirm must be consistent." })
      
      if not (re.match(passwordRegExp, old_password) and re.match(passwordRegExp, new_password) and re.match(passwordRegExp, new_password_confirm)):
         return jsonify({ "error": True, "message": "Change Falied, format of Password is wrong." })
      
      updateUser(userId, password = new_password)

      if selectUser(id = userId, provider = "local")["password"] == new_password:
         return jsonify({ "ok": True, "message": "Change Password Success"})
      else:
         return jsonify({ "error": True, "message": "Change Password Failed. Please Try again." })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "Server Internal Error" })

@api_setting.route("/room", methods=["GET"])
def getRoom():
   try:
      if "user" not in session:
         return jsonify({ "error": True, "message": "Please sign in first." })

      class variables():
         userId = session["user"]["id"]

      if selectMainLayout(user_id = variables.userId):
         mainHtmlId = selectMainLayout(user_id = variables.userId)["html_id"]
         mainId = selectMainLayout(user_id = variables.userId)["id"]
         mainObjectsList = selectMainToObjects(mainId)

         subSvgs = selectSubLayouts(mainId)

         subSvgList = []
         if subSvgs:
            for subSvg in subSvgs:
               subObjects = selectSubToObjects(subSvg["sub_id"])
               subObjectList = []
               if subObjects:
                  for object in subObjects:
                     subObjectList.append(object)

               subSvgDict = {
						"html_id": subSvg["html_id"],
						"image": subSvg["image"],
                  "object_array" : subObjectList
					}
               subSvgList.append(subSvgDict)
         
         data = {
				"main_svg": {
					"html_id": mainHtmlId,
               "object_array": mainObjectsList
				},
				"sub_svg": subSvgList
			}
         if data["main_svg"]["html_id"]:
            return jsonify({ "data": data })
         else:
            return jsonify({ "data": None })
      else:
         return jsonify({ "data": None })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "Server Internal Error" })

@api_setting.route("/room", methods=["POST"])
def postRoom():
   try:
      if "user" not in session:
         return jsonify({ "error": True, "message": "Please sign in first." })

      class variables():
         mainHtmlId = request.get_json()["main_svg"]["html_id"]
         userId = session["user"]["id"]
      
      insertMainLayout(user_id = variables.userId, html_id = variables.mainHtmlId)

      if selectMainLayout(user_id = variables.userId):
         return jsonify({ "ok": True, "message": "Create Success" })
      else:
         return jsonify({ "error": True, "message": "Create Failed" })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "Server Internal Error" })