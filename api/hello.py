# api/hello.py
def handler(event, context):
    return {
        "statusCode": 200,
        "body": "✅ OK"
    }