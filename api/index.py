import json

def handler(request, context):
    # seu código — por exemplo, retorna todos os routes ou faz lógica
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "Olá do Python na Vercel!"})
    }
