from mysql.connector import pooling
from dotenv import load_dotenv
import os
import json

load_dotenv()

try:
   connection_pool = pooling.MySQLConnectionPool(
      pool_name = "taipei_pool",
      pool_size = 5,
      pool_reset_session = True,
      host = os.getenv("SERVER_HOST"),
      port = os.getenv("SERVER_PORT"),
      user = os.getenv("SERVER_USER"),
      password = os.getenv("SERVER_PASSWORD"),
      database = os.getenv("SERVER_DATABASE"),
      charset = "utf8")
except Exception as e:
   print(e)  

def closePool(connection_object, taipeiCursor):
   if connection_object.is_connected():
      taipeiCursor.close()
      connection_object.close()
# ====================
# for /api/attraction
def selectAttractions(**kwargs):
   attractionsDataList = []
   try:
      pageStart = kwargs["page"] * 12
      pageInterval = 12 

      sql_cmd = """
               SELECT * 
               FROM attractions 
               LIMIT %s, %s
               """
      value = (pageStart, pageInterval)

      if kwargs["keyword"]:
         sql_cmd = """
               SELECT * 
               FROM attractions 
               WHERE name REGEXP %s
               LIMIT %s, %s
               """
         value = (kwargs["keyword"], pageStart, pageInterval)
      
      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd, value)
         taipeiResults = taipeiCursor.fetchall()
      
      if taipeiResults:
         for taipeiResult in taipeiResults:
            attractionsData = dict(zip(taipeiCursor.column_names, taipeiResult))
            attractionsData["images"] = json.loads(attractionsData["images"])
            attractionsDataList.append(attractionsData)
         return attractionsDataList
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, taipeiCursor)

def selectAttraction(attractionId):
   try:
      sql_cmd = f"""
               SELECT *
               FROM attractions
               WHERE id = { attractionId }
               """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)
         taipeiResult = taipeiCursor.fetchone()

      if taipeiResult:
         attractionData = dict(zip(taipeiCursor.column_names, taipeiResult))
         attractionData["images"] = json.loads(attractionData["images"])
         return attractionData
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, taipeiCursor)     
# ====================
# for /api/user
def selectUser(**kwargs):
   try:
      sql_cmd = """
               SELECT *
               FROM users
               WHERE
               """

      for key in kwargs:
        sql_cmd += f"{ key } = '{ kwargs[key] }' and "
      
      sql_cmd = sql_cmd[:-5] # 扣除掉 " and "

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)
         taipeiResult = taipeiCursor.fetchone()      

      if taipeiResult:
         userData = dict(zip(taipeiCursor.column_names, taipeiResult))
         return userData
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, taipeiCursor)      

def insertUser(**kwargs):
   try:
      insertColumn = ''
      insertValue = ''

      for key in kwargs:
        insertColumn += f"{ key }, "
        insertValue += f"'{ kwargs[key] }', "

      insertColumn = insertColumn[:-2]
      insertValue = insertValue[:-2]
      
      sql_cmd = f"""
            INSERT INTO users ({ insertColumn })
            VALUES ({ insertValue })
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)
         connection_object.commit()
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, taipeiCursor)        
# ====================
# for /api/booking
def selectBooking(**kwargs):
   try:
      sql_cmd = f"""
               SELECT a.id, a.name, a.address, a.images, b.date, b.time, b.price  
               FROM bookings b 
               JOIN attractions a ON b.attractionId = a.id 
               WHERE b.userId = { kwargs["userId"] }
               """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)               
         taipeiResult = taipeiCursor.fetchone()

      if taipeiResult:
         bookingData = dict(zip(taipeiCursor.column_names, taipeiResult))
         return bookingData
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, taipeiCursor)        

def insertBooking(**kwargs):
   try:
      insertColumn = ''
      insertValue = ''

      for key in kwargs:
         insertColumn += f"{ key }, "
         if type(kwargs[key]) == str:
            insertValue += f"'{ kwargs[key] }', "
         else: 
            insertValue += f"{ kwargs[key] }, "

      insertColumn = insertColumn[:-2]
      insertValue = insertValue[:-2]

      sql_cmd = f"""
            INSERT INTO bookings ({ insertColumn })
            VALUES ({ insertValue })
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)                
         connection_object.commit()
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, taipeiCursor)        

def updateBooking(userId, **kwargs):
   try:
      updateColumnAndValue = ""

      for key in kwargs:
         if type(kwargs[key]) == str:
            updateColumnAndValue += f"{ key } = '{ kwargs[key] }', "
         else: 
            updateColumnAndValue += f"{ key } = { kwargs[key] }, "

      updateColumnAndValue = updateColumnAndValue[:-2]

      sql_cmd = f"""
            UPDATE bookings 
            SET { updateColumnAndValue }
            WHERE userId = { userId }
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)                
         connection_object.commit()            
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, taipeiCursor)        

def deleteBookingData(**kwargs):
   try:
      deleteId = kwargs["userId"]

      sql_cmd = f"""
            DELETE FROM bookings 
            WHERE userId = { deleteId }
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)                
         connection_object.commit()              
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, taipeiCursor)        
# ====================
# for /api/order
def insertOrder(**kwargs):
   try:
      insertColumn = ''
      insertValue = ''

      for key in kwargs:
         insertColumn += f"{ key }, "
         if type(kwargs[key]) == str:
            insertValue += f"'{ kwargs[key] }', "
         else: 
            insertValue += f"{ kwargs[key] }, "

      insertColumn = insertColumn[:-2]
      insertValue = insertValue[:-2]

      sql_cmd = f"""
            INSERT INTO orders ({ insertColumn })
            VALUES ({ insertValue })
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)             
         connection_object.commit()
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, taipeiCursor)        

def selectOrder(number, userId):
   try:
      sql_cmd = f"""
               SELECT 
                  o.number, o.price, o.date, o.time, o.status, o.attractionId, o.phone,
                  a.name AS attr_name, a.address, a.images,
                  u.name AS user_name, u.email
               FROM orders o
               JOIN attractions a ON o.attractionId = a.id
               JOIN users u ON o.userId = u.id
               WHERE o.number = '{ number }' AND o.userId = { userId }
               """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)                
         taipeiResult = taipeiCursor.fetchone()

      if taipeiResult:
         orderData = dict(zip(taipeiCursor.column_names, taipeiResult))
         return orderData
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, taipeiCursor) 

def updateOrder(number, **kwargs):
   try:
      updateColumnAndValue = ""

      for key in kwargs:
         if type(kwargs[key]) == str:
            updateColumnAndValue += f"{ key } = '{ kwargs[key] }', "
         else: 
            updateColumnAndValue += f"{ key } = { kwargs[key] }, "

      updateColumnAndValue = updateColumnAndValue[:-2]

      sql_cmd = f"""
            UPDATE orders 
            SET { updateColumnAndValue }
            WHERE number = '{ number }'
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)                
         connection_object.commit()            
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, taipeiCursor)

def selectOrders(userId):
   orderDataList = []
   try:
      sql_cmd = f"""
               SELECT o.number, o.attractionId, o.status, a.name AS attr_name
               FROM orders o
               JOIN attractions a ON o.attractionId = a.id
               WHERE o.userId = { userId }
               """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         taipeiCursor = connection_object.cursor()
         taipeiCursor.execute(sql_cmd)                
         taipeiResults = taipeiCursor.fetchall()

      if taipeiResults:
         for taipeiResult in taipeiResults:
            orderData = dict(zip(taipeiCursor.column_names, taipeiResult))
            orderDataList.append(orderData)
         return orderDataList
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, taipeiCursor)