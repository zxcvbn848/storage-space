import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

db = mysql.connector.connect(
   host = os.getenv("SERVER_HOST"),
   port = os.getenv("SERVER_PORT"),
   user = os.getenv("SERVER_USER"),
   password = os.getenv("SERVER_PASSWORD"),
   database = os.getenv("SERVER_DATABASE"),
   charset = "utf8"
)

cursor = db.cursor()


cursor.execute("""
   SET FOREIGN_KEY_CHECKS = 0;
   """
)
# cursor.execute("""
#    DROP TABLE IF EXISTS users;
#    """
# )
cursor.execute("""
   DROP TABLE IF EXISTS main_layout;
   """
)
cursor.execute("""
   DROP TABLE IF EXISTS main_to_objects;
   """
)
cursor.execute("""
   DROP TABLE IF EXISTS objects;
   """
)
cursor.execute("""
   DROP TABLE IF EXISTS sub_layout;
   """
)
cursor.execute("""
   DROP TABLE IF EXISTS sub_to_objects;
   """
)
cursor.execute("""
   DROP TABLE IF EXISTS main_to_subs;
   """
)
cursor.execute("""
   SET FOREIGN_KEY_CHECKS = 1;
   """
)

cursor.execute("""
   CREATE TABLE IF NOT EXISTS users(
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL, 
      email VARCHAR(255) NOT NULL UNIQUE, 
      password VARCHAR(255),
      provider VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)) charset=utf8;
   """
)

cursor.execute("""
   CREATE TABLE IF NOT EXISTS objects(
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      x BIGINT NOT NULL,
      y BIGINT NOT NULL,
      width BIGINT NOT NULL,
      height BIGINT NOT NULL,
      href TEXT NOT NULL,
      data_layout VARCHAR(255),
      PRIMARY KEY (id)) charset=utf8;
   """
)

cursor.execute("""
   CREATE TABLE IF NOT EXISTS sub_layout(
      id BIGINT NOT NULL AUTO_INCREMENT,
      image TEXT NOT NULL,
      html_id TEXT NOT NULL,
      PRIMARY KEY (id)) charset=utf8;
   """
)

cursor.execute("""
   CREATE TABLE IF NOT EXISTS sub_to_objects(
      id BIGINT NOT NULL AUTO_INCREMENT,
      sub_id BIGINT NOT NULL,
      object_id BIGINT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY(sub_id) REFERENCES sub_layout(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY(object_id) REFERENCES objects(id) ON DELETE CASCADE ON UPDATE CASCADE) charset=utf8;
   """
)

cursor.execute("""
   CREATE TABLE IF NOT EXISTS main_layout(
      id BIGINT NOT NULL AUTO_INCREMENT,
      user_id BIGINT NOT NULL,
      html_id TEXT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE) charset=utf8;
   """
)
cursor.execute("""
   CREATE TABLE IF NOT EXISTS main_to_objects(
      id BIGINT NOT NULL AUTO_INCREMENT,
      main_id BIGINT NOT NULL,
      object_id BIGINT NOT NULL, 
      PRIMARY KEY (id),
      FOREIGN KEY(main_id) REFERENCES main_layout(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY(object_id) REFERENCES objects(id) ON DELETE CASCADE ON UPDATE CASCADE) charset=utf8;
   """
)
cursor.execute("""
   CREATE TABLE IF NOT EXISTS main_to_subs(
      id BIGINT NOT NULL AUTO_INCREMENT,
      main_id BIGINT NOT NULL,
      sub_id BIGINT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY(main_id) REFERENCES main_layout(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY(sub_id) REFERENCES sub_layout(id) ON DELETE CASCADE ON UPDATE CASCADE) charset=utf8;
   """
)

# cursor.execute("""
#    CREATE TABLE IF NOT EXISTS user_to_main(
#       id BIGINT NOT NULL AUTO_INCREMENT,
#       user_id BIGINT NOT NULL,
#       main_id BIGINT NOT NULL,
#       PRIMARY KEY (id),
#       FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
#       FOREIGN KEY(main_id) REFERENCES main_layout(id) ON DELETE CASCADE ON UPDATE CASCADE) charset=utf8;
#    """
# )

db.commit()