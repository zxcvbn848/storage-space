from dotenv import load_dotenv
import os

load_dotenv()

S3_BUCKET = os.getenv("S3_BUCKET")
S3_KEY = os.getenv("S3_KEY")
S3_SECRET = os.getenv("S3_SECRET")
CLOUDFRONT_NAME = os.getenv("CLOUDFRONT_NAME")
CLOUDFRONT_LOCATION= f"https://{CLOUDFRONT_NAME}/"

basepath = os.path.join(os.path.dirname(__file__), "static", "upload")