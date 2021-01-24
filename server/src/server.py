from flask import Flask
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import json
import csv
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/api/process')
def process_data(data):
    """
    read, store, calculate
    """
    response = {}

    with open(data["csv_file"]) as csv_file:
        pass

    return json.dumps(response)

if __name__ == "__main__":
    cloud_config= {'secure_connect_bundle': os.environ['SECURE_CONNECT_PATH']}
    auth_provider = PlainTextAuthProvider(os.environ['DATABASE_USER'], os.environ['DATABASE_PASSWORD'])
    cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
    session = cluster.connect()

    session.set_keyspace('transactions')
    with open('./datasets/Pizza_Takeaway_Dataset.csv', 'r') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        next(csv_reader) #skip header
        for row in csv_reader:
            session.execute("""
                            INSERT INTO transactions.transaction_data
                            (id, doc_id, date, category, amount, currency, localamount, localcurrency)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                            """,
                            (uuid.uuid4(), 0, row[2], row[7], float(row[8]), row[9], float(row[10]), row[11]))
            print(row[0])
