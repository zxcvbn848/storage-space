from mysql.connector import pooling
from dotenv import load_dotenv
import os
import json

load_dotenv()

try:
   connection_pool = pooling.MySQLConnectionPool(
      pool_name = "storage_pool",
      pool_size = 20,
      pool_reset_session = True,
      host = os.getenv("SERVER_HOST"),
      port = os.getenv("SERVER_PORT"),
      user = os.getenv("SERVER_USER"),
      password = os.getenv("SERVER_PASSWORD"),
      database = os.getenv("SERVER_DATABASE"),
      charset = "utf8")
except Exception as e:
   print(e)  

def closePool(connection_object, cursor):
   if connection_object.is_connected():
      cursor.close()
      connection_object.close()
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
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)
         result = cursor.fetchone()      

      if result:
         return result
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)      

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
         cursor = connection_object.cursor()
         cursor.execute(sql_cmd)
         connection_object.commit()
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)  

def updateUser(userId, **kwargs):
   try:
      updateColumnAndValue = ""

      for key in kwargs:
         if type(kwargs[key]) == str:
            updateColumnAndValue += f"{ key } = '{ kwargs[key] }', "
         else: 
            updateColumnAndValue += f"{ key } = { kwargs[key] }, "

      updateColumnAndValue = updateColumnAndValue[:-2]

      sql_cmd = f"""
            UPDATE users 
            SET { updateColumnAndValue }
            WHERE id = { userId }
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor()
         cursor.execute(sql_cmd)                
         connection_object.commit()            
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)  
# ====================
# for /api/layout (main_layout)
def selectMainLayouts(**kwargs):
   dataList = []
   try:
      sql_cmd = """
               SELECT * 
               FROM main_layout
               WHERE
               """
      for key in kwargs:
         if type(kwargs[key]) == str:
            sql_cmd += f"{ key } = '{ kwargs[key] }' and "
         else: 
            sql_cmd += f"{ key } = { kwargs[key] } and "
      
      sql_cmd = sql_cmd[:-5] # 扣除掉 " and "

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)
         results = cursor.fetchall()
      
      if results:
         for result in results:
            dataList.append(result)
         return dataList
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)

def selectMainLayout(**kwargs):
   try:
      sql_cmd = f"""
               SELECT *  
               FROM main_layout 
               WHERE
               """

      for key in kwargs:
         if type(kwargs[key]) == str:
            sql_cmd += f"{ key } = '{ kwargs[key] }' and "
         else: 
            sql_cmd += f"{ key } = { kwargs[key] } and "
      
      sql_cmd = sql_cmd[:-5] # 扣除掉 " and "
      
      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)               
         result = cursor.fetchone()

      if result:
         return result
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)        

def insertMainLayout(**kwargs):
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
            INSERT INTO main_layout ({ insertColumn })
            VALUES ({ insertValue })
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)                
         connection_object.commit()
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)       

def updateMainLayout(userId, mainId, **kwargs):
   try:
      updateColumnAndValue = ""

      for key in kwargs:
         if type(kwargs[key]) == str:
            updateColumnAndValue += f"{ key } = '{ kwargs[key] }', "
         else: 
            updateColumnAndValue += f"{ key } = { kwargs[key] }, "

      updateColumnAndValue = updateColumnAndValue[:-2]

      sql_cmd = f"""
            UPDATE main_layout 
            SET { updateColumnAndValue }
            WHERE user_id = { userId } AND id = { mainId }
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor()
         cursor.execute(sql_cmd)                
         connection_object.commit()            
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)        

def deleteMainLayout(**kwargs):
   try:
      deleteId = kwargs["userId"]

      sql_cmd = f"""
            DELETE FROM main_layout 
            WHERE userId = { deleteId }
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor()
         cursor.execute(sql_cmd)                
         connection_object.commit()              
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)       
# ====================
# for /api/layout (main_to_subs)
def selectMainToSub(**kwargs):
   dataList = []
   try:
      sql_cmd = """
               SELECT * 
               FROM main_to_subs
               WHERE
               """
      for key in kwargs:
         if type(kwargs[key]) == str:
            sql_cmd += f"{ key } = '{ kwargs[key] }' and "
         else: 
            sql_cmd += f"{ key } = { kwargs[key] } and "
      
      sql_cmd = sql_cmd[:-5] # 扣除掉 " and "

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)
         results = cursor.fetchall()
      
      if results:
         for result in results:
            dataList.append(result)
         return dataList
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)

def insertMainToSub(**kwargs):
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
            INSERT INTO main_to_subs ({ insertColumn })
            VALUES ({ insertValue })
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)                
         connection_object.commit()
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)
# ====================
# for /api/layout (sub_layout)
def selectSubLayouts(mainId):
   dataList = []
   try:
      sql_cmd = f"""
               SELECT *
               FROM sub_layout sl
               INNER JOIN main_to_subs mts
               ON sl.id = mts.sub_id
               WHERE mts.main_id = { mainId }
               """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)
         results = cursor.fetchall()
      
      if results:
         for result in results:
            dataList.append(result)
         return dataList
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)

def selectSubLayout(**kwargs):
   try:
      sql_cmd = f"""
               SELECT *  
               FROM sub_layout 
               WHERE
               """

      for key in kwargs:
         if type(kwargs[key]) == str:
            sql_cmd += f"{ key } = '{ kwargs[key] }' and "
         else: 
            sql_cmd += f"{ key } = { kwargs[key] } and "
      
      sql_cmd = sql_cmd[:-5] # 扣除掉 " and "
      
      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)               
         result = cursor.fetchone()

      if result:
         return result
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor) 

def insertSubLayout(**kwargs):
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
            INSERT INTO sub_layout ({ insertColumn })
            VALUES ({ insertValue })
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)                
         connection_object.commit()
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)

def updateSubLayout(mainId, htmlId, **kwargs):
   try:
      updateColumnAndValue = ""

      for key in kwargs:
         if type(kwargs[key]) == str:
            updateColumnAndValue += f"{ key } = '{ kwargs[key] }', "
         else: 
            updateColumnAndValue += f"{ key } = { kwargs[key] }, "

      updateColumnAndValue = updateColumnAndValue[:-2]

      sql_cmd = f"""
            UPDATE sub_layout 
            SET { updateColumnAndValue }
            WHERE main_id = { mainId } AND html_id = '{ htmlId }'
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor()
         cursor.execute(sql_cmd)                
         connection_object.commit()            
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)

def deleteSubLayouts(mainId):
   try:
      sql_cmd = f"""
            DELETE sl
            FROM sub_layout sl
            INNER JOIN main_to_subs mts
            ON sl.id = mts.sub_id
            WHERE mts.main_id = { mainId }
            """
      
      reset_sub_layout_id = "ALTER TABLE sub_layout AUTO_INCREMENT = 1;"
      reset_main_to_subs_id = "ALTER TABLE main_to_subs AUTO_INCREMENT = 1;"

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor()
         cursor.execute(sql_cmd)
         cursor.execute(reset_sub_layout_id)
         cursor.execute(reset_main_to_subs_id)  
         connection_object.commit()              
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)

def deleteSubLayout(htmlId):
   try:
      sql_cmd = f"""
            DELETE FROM sub_layout 
            WHERE html_id = '{ htmlId }'
            """
      
      reset_sub_layout_id = "ALTER TABLE sub_layout AUTO_INCREMENT = 1;"

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor()
         cursor.execute(sql_cmd)
         cursor.execute(reset_sub_layout_id)
         connection_object.commit()              
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)
# ====================
# for /api/layout (main_to_objects)
def selectMainToObjects(mainId):
   dataList = []
   try:
      sql_cmd = f"""
               SELECT o.name, o.x, o.y, o.width, o.height, o.href, o.data_layout
               FROM main_to_objects mto
               INNER JOIN objects o
               ON o.id = mto.object_id
               WHERE mto.main_id = { mainId }
               """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)
         results = cursor.fetchall()
      
      if results:
         for result in results:
            dataList.append(result)
         return dataList
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)

def selectMainToObject(**kwargs):
   try:
      sql_cmd = f"""
               SELECT *  
               FROM main_to_objects 
               WHERE
               """

      for key in kwargs:
         if type(kwargs[key]) == str:
            sql_cmd += f"{ key } = '{ kwargs[key] }' and "
         else: 
            sql_cmd += f"{ key } = { kwargs[key] } and "
      
      sql_cmd = sql_cmd[:-5] # 扣除掉 " and "
      
      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)               
         result = cursor.fetchone()

      if result:
         return result
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor) 

def insertMainToObjects(**kwargs):
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
            INSERT INTO main_to_objects ({ insertColumn })
            VALUES ({ insertValue })
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)                
         connection_object.commit()
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)
# ====================
# for /api/layout (sub_to_objects)
def selectSubToObjects(subId):
   dataList = []
   try:
      sql_cmd = f"""
               SELECT o.name, o.x, o.y, o.width, o.height, o.href, o.data_layout
               FROM sub_to_objects sto
               INNER JOIN objects o
               ON o.id = sto.object_id
               WHERE sto.sub_id = { subId }               
               """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)
         results = cursor.fetchall()
      
      if results:
         for result in results:
            dataList.append(result)
         return dataList
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)

def selectSubToObject(**kwargs):
   try:
      sql_cmd = f"""
               SELECT *  
               FROM sub_to_objects 
               WHERE
               """

      for key in kwargs:
         if type(kwargs[key]) == str:
            sql_cmd += f"{ key } = '{ kwargs[key] }' and "
         else: 
            sql_cmd += f"{ key } = { kwargs[key] } and "
      
      sql_cmd = sql_cmd[:-5] # 扣除掉 " and "
      
      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)               
         result = cursor.fetchone()

      if result:
         return result
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)

def insertSubToObjects(**kwargs):
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
            INSERT INTO sub_to_objects ({ insertColumn })
            VALUES ({ insertValue })
            """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)                
         connection_object.commit()
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)
# ====================
# for /api/layout (objects)
def selectObjects(**kwargs):
   dataList = []
   try:
      sql_cmd = """
               SELECT * 
               FROM objects
               WHERE
               """
      for key in kwargs:
         if not kwargs[key]:
            continue
         elif type(kwargs[key]) == str:
            sql_cmd += f"{ key } = '{ kwargs[key] }' and "
         else: 
            sql_cmd += f"{ key } = { kwargs[key] } and "
      
      sql_cmd = sql_cmd[:-5] # 扣除掉 " and "

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)
         results = cursor.fetchall()
      
      if results:
         for result in results:
            dataList.append(result)
         return dataList
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)

def selectObject(**kwargs):
   try:
      sql_cmd = f"""
               SELECT *  
               FROM objects 
               WHERE
               """

      for key in kwargs:
         if not kwargs[key]:
            continue
         elif type(kwargs[key]) == str:
            sql_cmd += f"{ key } = '{ kwargs[key] }' and "
         else: 
            sql_cmd += f"{ key } = { kwargs[key] } and "
      
      sql_cmd = sql_cmd[:-5] # 扣除掉 " and "
      
      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)               
         result = cursor.fetchone()

      if result:
         return result
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)

def insertObjects(**kwargs):
   try:
      insertColumn = ''
      insertValue = ''

      for key in kwargs:
         insertColumn += f"{ key }, "
         if not kwargs[key]:
            insertValue += f"NULLIF('{ kwargs[key] }', 'None'), "
         elif type(kwargs[key]) == str:
            insertValue += f"'{ kwargs[key] }', "
         else: 
            insertValue += f"{ kwargs[key] }, "

      insertColumn = insertColumn[:-2]
      insertValue = insertValue[:-2]

      sql_cmd = f"""
            INSERT INTO objects ({ insertColumn })
            VALUES ({ insertValue })
            """
            
      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)                
         connection_object.commit()
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)

def deleteMainObjects(mainId):
   try:
      sql_cmd = f"""
            DELETE o
            FROM objects o
            INNER JOIN main_to_objects mto
            ON o.id = mto.object_id
            WHERE mto.main_id = { mainId }
            """
      
      reset_objects_id = "ALTER TABLE objects AUTO_INCREMENT = 1;"
      reset_main_to_objects_id = "ALTER TABLE main_to_objects AUTO_INCREMENT = 1;"

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor()
         cursor.execute(sql_cmd)                
         cursor.execute(reset_objects_id)
         cursor.execute(reset_main_to_objects_id)
         connection_object.commit()              
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)

def deleteSubObjects(subId):
   try:
      sql_cmd = f"""
            DELETE o
            FROM objects o
            INNER JOIN sub_to_objects sto
            ON o.id = sto.object_id
            WHERE sto.sub_id = { subId }
            """
      
      reset_objects_id = "ALTER TABLE objects AUTO_INCREMENT = 1;"
      reset_main_to_objects_id = "ALTER TABLE main_to_objects AUTO_INCREMENT = 1;"

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor()
         cursor.execute(sql_cmd)                
         cursor.execute(reset_objects_id)
         cursor.execute(reset_main_to_objects_id)
         connection_object.commit()              
   except Exception as e:
      print(e)
   finally:
      closePool(connection_object, cursor)
# ====================
# for /api/layout (objects_to_subs)
def selectObjectToSub(name, mainId):
   dataList = []
   try:
      sql_cmd = f"""
               SELECT sl.id, sl.html_id, sl.image
               FROM objects o
               INNER JOIN sub_to_objects sto
               ON o.id = sto.object_id
               INNER JOIN sub_layout sl
               ON sto.sub_id = sl.id
               INNER JOIN main_to_subs mts
               ON mts.sub_id = sl.id
               WHERE o.name = '{ name }' AND mts.main_id = { mainId }       
               """

      connection_object = connection_pool.get_connection()

      if connection_object.is_connected():
         cursor = connection_object.cursor(dictionary = True)
         cursor.execute(sql_cmd)
         results = cursor.fetchall()
      
      if results:
         for result in results:
            dataList.append(result)
         return dataList
      else:
         return None
   except Exception as e:
      print(e)
      return None
   finally:
      closePool(connection_object, cursor)