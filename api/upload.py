from mysql_connect import insertPost
import sys
sys.path.append("..")

import logging
from flask import request, Blueprint, jsonify
from werkzeug.utils import secure_filename

from mysql_connect import *
from s3 import *
from config import *

api_upload = Blueprint('api_upload', __name__)

@api_upload.route("/upload", methods=["POST"])
def postUpload(): 
	try:
		text = request.form["text"]

		if not text:
			return jsonify({ "error": True, "message": "文字未填" })

		if "image" not in request.files:
			return jsonify({ "error": True, "message": "未選取檔案" })

		image = request.files["image"]

		if image.filename == "":
			return jsonify({ "error": True, "message": "未選取檔案" })

		if image and allowed_file(image.filename):
			image.filename = secure_filename(image.filename)
			imageUrl = str(upload_file_to_s3(image, S3_BUCKET))
		
		insertPost(description = text, image_url = imageUrl)

		selectedPost = selectPost(image_url = imageUrl)

		if selectedPost:
			data = {
				"text": selectedPost["description"],
				"image_url": selectedPost["image_url"]
			}

			if data["text"] and data["image_url"]:
				return jsonify({ "data": data })
		else:
			return jsonify({ "data": None })	
	except Exception as e:
		logging.error(e)
		return jsonify({ "error": True, "message": "伺服器內部錯誤" })