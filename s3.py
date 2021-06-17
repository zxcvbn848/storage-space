import logging
import boto3

from config import *

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

def allowed_file(filename):
   return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def s3_client():
   return boto3.client(
      "s3",
      aws_access_key_id = S3_KEY,
      aws_secret_access_key = S3_SECRET
   )

s3 = s3_client()

def upload_file_to_s3(file, bucket_name, acl = "public-read"):
   try:
      s3.upload_fileobj(
         Fileobj = file,
         Bucket = bucket_name, 
         Key = file.filename,
         ExtraArgs = {
            "ACL": acl,
            "ContentType": file.content_type
            }
         )
   except Exception as e:
      logging.error(f"upload file {file.filename} failed! {e}")
      return e
   return f"{CLOUDFRONT_LOCATION}{file.filename}"