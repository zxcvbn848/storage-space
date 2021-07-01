import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

websiteDB = mysql.connector.connect(
   host = os.getenv("SERVER_HOST"),
   port = os.getenv("SERVER_PORT"),
   user = os.getenv("SERVER_USER"),
   password = os.getenv("SERVER_PASSWORD"),
   database = os.getenv("SERVER_DATABASE"),
   charset = "utf8"
)

webCursor = websiteDB.cursor()

webCursor.execute("""
   CREATE TABLE IF NOT EXISTS main_layout(
      id BIGINT NOT NULL AUTO_INCREMENT,
      user_id BIGINT NOT NULL,
      main TEXT NOT NULL, 
      sub_id BIGINT NOT NULL, 
      PRIMARY KEY (id)) charset=utf8;
   """
)
webCursor.execute("""
   CREATE TABLE IF NOT EXISTS sub_layout(
      id BIGINT NOT NULL AUTO_INCREMENT,
      user_id BIGINT NOT NULL,
      main_id BIGINT NOT NULL,
      sub TEXT NOT NULL, 
      PRIMARY KEY (id)) charset=utf8;
   """
)

websiteDB.commit()