from flask import Flask, render_template
from datetime import timedelta
from dotenv import load_dotenv
import os

from api.layout import api_layout
from api.user import api_user
from api.setting import api_setting

load_dotenv()

GOOGLE_OAUTH2_CLIENT_ID = os.getenv("GOOGLE_OAUTH2_CLIENT_ID")

app = Flask(__name__)
app.register_blueprint(api_layout, url_prefix="/api")
app.register_blueprint(api_user, url_prefix="/api")
app.register_blueprint(api_setting, url_prefix="/api/setting")

app.config["JSON_SORT_KEYS"] = False
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

app.config["SECRET_KEY"] = os.urandom(24)
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days = 1)

@app.route("/")
def index():
	return render_template("index.html", google_oauth2_client_id = GOOGLE_OAUTH2_CLIENT_ID)
@app.route("/signin-up")
def demo():
	return render_template("signin-up.html", google_oauth2_client_id = GOOGLE_OAUTH2_CLIENT_ID)
@app.route("/member")
def order():
	return render_template("member.html", google_oauth2_client_id = GOOGLE_OAUTH2_CLIENT_ID)

@app.route("/item-list")
def itemList():
	return render_template("item-list.html", google_oauth2_client_id = GOOGLE_OAUTH2_CLIENT_ID)
@app.route("/item-layout")
def itemLayout():
	return render_template("item-layout.html", google_oauth2_client_id = GOOGLE_OAUTH2_CLIENT_ID)
# @app.route("/add-item")
# def addItem():
# 	return render_template("add-item.html")
# @app.route("/edit-item")
# def editItem():
# 	return render_template("edit-item.html")

if __name__ == "__main__":
	app.run(host = "0.0.0.0", port = 3000
		, debug = True
	)
