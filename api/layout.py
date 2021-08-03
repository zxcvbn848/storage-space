import re
import sys
sys.path.append("..")

import logging
from flask import request, Blueprint, jsonify, session

from mysql_connect import *

api_layout = Blueprint('api_layout', __name__)

# TBD: For search item recursion
def searchRecursion(allSubSvgs, keyword, mainId, subSvgList):
	# Find subSvg that contains keyword object
	searchedSubs = selectObjectToSub(keyword, mainId)
	if not searchedSubs:
		return
	print(searchedSubs)

	if allSubSvgs:
		for subSvg in allSubSvgs:
			# Same layer of Keyword
			for searchedSub in searchedSubs:
				if subSvg["html_id"] == searchedSub["html_id"]:
					subObjects = selectSubToObjects(subSvg["sub_id"])

					subObjectList = []
					if subObjects:
						for object in subObjects:
							# Above layer of keyword
							subObjectList.append(object)
							searchRecursion(allSubSvgs, object["name"], mainId, subSvgList)

					subSvgDict = {
						"html_id": subSvg["html_id"],
						"image": subSvg["image"],
						"object_array" : subObjectList
					}
					subSvgList.append(subSvgDict)

# For all item
@api_layout.route("/layouts", methods=["GET"])
def getLayouts(): 
	try:
		if "user" not in session:
			return jsonify({ "error": True, "message": "Please sign in first." })

		userId = session["user"]["id"]
		
		if selectMainLayout(user_id = userId):
			mainHtmlId = selectMainLayout(user_id = userId)["html_id"]
			mainId = selectMainLayout(user_id = userId)["id"]
			mainObjectsList = selectMainToObjects(mainId)

			allSubSvgs = selectSubLayouts(mainId)
			
			subSvgList = []
			if allSubSvgs:
				for subSvg in allSubSvgs:
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
		logging.error(e)
		return jsonify({ "error": True, "message": "Server Internal Error" })

@api_layout.route("/layout/main/<int:id>", methods=["GET"])
def getMainLayout(id): 
	try:
		if "user" not in session:
			return jsonify({ "error": True, "message": "Please sign in first." })
		svg = selectMainLayout(id = id)

		if svg:
			return jsonify({ "data": svg })
		else:
			return jsonify({ "data": None })
	except Exception as e:
		logging.error(e)
		return jsonify({ "error": True, "message": "Server Internal Error" })

@api_layout.route("/layout/sub/<int:id>", methods=["GET"])
def getSubLayout(id): 
	try:
		if "user" not in session:
			return jsonify({ "error": True, "message": "Please sign in first." })
		svg = selectSubLayout(id = id)

		if svg:
			return jsonify({ "data": svg })
		else:
			return jsonify({ "data": None })
	except Exception as e:
		logging.error(e)
		return jsonify({ "error": True, "message": "Server Internal Error" })

# For search item
@api_layout.route("/layout", methods=["GET"])
def getLayout():
	try:
		if "user" not in session:
			return jsonify({ "error": True, "message": "Please sign in first." })

		keyword = request.args.get("keyword").replace(" ", "%20")
		userId = session["user"]["id"]
		
		if selectMainLayout(user_id = userId):
			mainHtmlId = selectMainLayout(user_id = userId)["html_id"]
			mainId = selectMainLayout(user_id = userId)["id"]
			mainObjectsList = selectMainToObjects(mainId)

			allSubSvgs = selectSubLayouts(mainId)

			subSvgList = []
			searchRecursion(allSubSvgs, keyword, mainId, subSvgList)
			
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
		logging.error(e)
		return jsonify({ "error": True, "message": "Server Internal Error" })

@api_layout.route("/layout", methods=["POST"])
def postLayout(): 
	try:
		if "user" not in session:
			return jsonify({ "error": True, "message": "Please sign in first." })

		class variables():
			mainSvgObjectsList = request.get_json()["main_svg"]["object_array"]
			mainHtmlId = request.get_json()["main_svg"]["html_id"]
			subSvgList = request.get_json()["sub_svg"]
			userId = session["user"]["id"]

		if selectMainLayout(user_id = variables.userId):
			mainId = selectMainLayout(user_id = variables.userId)["id"]
			deleteMainObjects(mainId)
		else:
			insertMainLayout(user_id = variables.userId, html_id = variables.mainHtmlId)

		for object in variables.mainSvgObjectsList:
			mainId = selectMainLayout(user_id = variables.userId)["id"]
			insertObjects(name = object["name"], x = object["x"], y = object["y"], width = object["width"], height = object["height"], href = object["href"], data_layout = object["data_layout"])
			insertedObjectId = selectObject(name = object["name"], x = object["x"], y = object["y"], width = object["width"], height = object["height"], href = object["href"], data_layout = object["data_layout"])["id"]
			insertMainToObjects(main_id = mainId, object_id = insertedObjectId)
	
		insertedMainLayout = selectMainLayout(user_id = variables.userId)

		global subBoolean
		global subId
		if variables.subSvgList:
			for subSvg in variables.subSvgList:
				if selectSubLayout(html_id = subSvg["html_id"]):
					subId = selectSubLayout(html_id = subSvg["html_id"])["id"]
					deleteSubObjects(subId)
					subBoolean = True
				else:
					insertSubLayout(image = subSvg["image"], html_id = subSvg["html_id"])
					insertedSubLayout = selectSubLayout(html_id = subSvg["html_id"])
					subId = insertedSubLayout["id"]
					insertMainToSub(main_id = insertedMainLayout["id"], sub_id = subId)
					if insertedSubLayout:
						subBoolean = True
					else: 
						subBoolean = False
				if subSvg["object_array"]:
					for object in subSvg["object_array"]:
						insertObjects(name = object["name"], x = object["x"], y = object["y"], width = object["width"], height = object["height"], href = object["href"], data_layout = object["data_layout"])
						insertedObjectId = selectObject(name = object["name"], x = object["x"], y = object["y"], width = object["width"], height = object["height"], href = object["href"], data_layout = object["data_layout"])["id"]
						insertSubToObjects(sub_id = subId, object_id = insertedObjectId)

			insertedSubLayouts = selectSubLayouts(insertedMainLayout["id"])
			htmlIdList = []
			for subSvg in variables.subSvgList:
				htmlIdList.append(subSvg["html_id"])
			for insertedSubLayout in insertedSubLayouts:
				if insertedSubLayout["html_id"] not in htmlIdList:
					deleteSubLayout(insertedSubLayout["html_id"])
			
			insertedSubLayouts = selectSubLayouts(insertedMainLayout["id"])

		if len(variables.subSvgList) > 0:
			if insertedMainLayout and subBoolean and len(insertedSubLayouts) == len(variables.subSvgList):
				return jsonify({ "ok": True, "message": "Save Success" })
			else:
				return jsonify({ "error": True, "message": "Save Failed" })
		else:
			if insertedMainLayout:
				return jsonify({ "ok": True, "message": "Save Success" })
			else:
				return jsonify({ "error": True, "message": "Save Failed" })
	except Exception as e:
		logging.error(e)
		return jsonify({ "error": True, "message": "Server Internal Error" })
