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
   CREATE TABLE IF NOT EXISTS posts(
      id BIGINT NOT NULL AUTO_INCREMENT,
      description VARCHAR(255) NOT NULL, 
      image_url VARCHAR(255) NOT NULL, 
      PRIMARY KEY (id)) charset=utf8;
   """
)

websiteDB.commit()