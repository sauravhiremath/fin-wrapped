from flask import Flask
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from dotenv import load_dotenv
from algos import compute_fin_health, compute_robustness, compute_projections
import json
import pandas as pd
import csv
import uuid
import os

load_dotenv()

app = Flask(__name__)

def generate_data():
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

@app.route('/api/process')
def process_data(data):
    """
    read, store, calculate
    """
    
    DATABASEID = -1
    with open(data["csv_file"]) as csv_file:
        if csv_file.name == "Hairdressers_Dataset.csv":
            DATABASEID = 1
        if csv_file.name == "Pizza_Takeaway_Dataset.csv":
            DATABASEID = 0
    
    cloud_config= {'secure_connect_bundle': os.environ['SECURE_CONNECT_PATH']}
    auth_provider = PlainTextAuthProvider(os.environ['DATABASE_USER'], os.environ['DATABASE_PASSWORD'])
    cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
    session = cluster.connect()
    dict = {'Amount':[], 'Date':[], 'Category':[]}
    cql_query = "SELECT amount, date, category FROM transactions.transaction_data WHERE doc_id={} ALLOW FILTERING".format(0)
    for row in session.execute(cql_query):
        dict['Amount'].append(row.amount)
        dict['Date'].append(row.date)
        dict['Category'].append(row.category)
    df = pd.DataFrame(dict)

    financial_health = round(compute_fin_health(df), 1)
    robustness_score = round(compute_robustness(df), 1)
    projections = compute_projections(df)

    df_income = df.loc[df['Amount'] >= 0]
    df_expense = df.loc[df['Amount'] < 0]

    income_cats = df_income['Category'].unique()
    income_data = {}
    for income_cat in income_cats:
        income_data[income_cat] = round(df_income['Amount'][df_income['Category'] == income_cat].sum(), 2)

    expense_data = {}
    expense_cats = df_expense['Category'].unique()
    for expense_cat in expense_cats:
        expense_data[expense_cat] = round(df_expense['Amount'][df_expense['Category'] == expense_cat].sum(), 2)

    response = {}
    response["original data"] = df.to_dict(orient='records')
    response["financial health"] = financial_health
    response["robustness score"] = robustness_score
    response["projections"] = projections.to_dict(orient='index')
    response["income data"] = income_data
    response["expense data"] = expense_data

    return json.dumps(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001)
