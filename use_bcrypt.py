import bcrypt

class hashPassword():
   def hashSalt(passwd):
      encodedPassword = str.encode(passwd)
      salt = bcrypt.gensalt(rounds=14)
      hashed = bcrypt.hashpw(encodedPassword, salt)
      decodedPassword = bytes.decode(hashed)
      return decodedPassword
         
   def hashSaltCheck(passwd, hashed):
      encodedPassword = str.encode(passwd)
      encodedHashPassword = str.encode(hashed)
      if bcrypt.checkpw(encodedPassword, encodedHashPassword):
         return True
      else:
         return False

# print(hashPassword.hashSaltCheck(b's$cret12', hashPassword.hashSalt(b's$cret12')))

# password = 'aA11'
# hashedPassword = hashPassword.hashSalt(password)
# print(hashedPassword)
