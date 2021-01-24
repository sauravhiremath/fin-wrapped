from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from dotenv import load_dotenv
from algos import compute_fin_health, compute_robustness, compute_projections, prepare_df
from io import StringIO
import pandas as pd
import csv
import uuid
import os

load_dotenv()

app = Flask(__name__)

def generate_data():
    import time
    start_time = time.time()
    cloud_config= {'secure_connect_bundle': os.environ['SECURE_CONNECT_PATH']}
    auth_provider = PlainTextAuthProvider(os.environ['DATABASE_USER'], os.environ['DATABASE_PASSWORD'])
    cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
    session = cluster.connect()
    session.set_keyspace('transactions')
    insert_stmt = session.prepare("""
                                 INSERT INTO transactions.transaction_data
                                 (id, doc_id, date, category, amount, currency, localamount, localcurrency)
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                                 """)

    with open('./datasets/Hairdressers_Dataset.csv', 'r') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        next(csv_reader) #skip header
        for row in csv_reader:
            session.execute_async(insert_stmt, [uuid.uuid4(), 0, row[2], row[7], float(row[8]), row[9], float(row[10]), row[11]])
            print(row[0])
    
    print(time.time() - start_time)

@app.route('/api/process', methods=['GET', 'POST'])
def process_data():
    """
    read, store, calculate
    """

    cloud_config= {'secure_connect_bundle': os.environ['SECURE_CONNECT_PATH']}
    auth_provider = PlainTextAuthProvider(os.environ['DATABASE_USER'], os.environ['DATABASE_PASSWORD'])
    cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
    session = cluster.connect()
    session.set_keyspace('transactions')

    insert_stmt = session.prepare("""
                                INSERT INTO transactions.transaction_data
                                (id, doc_id, date, category, amount, currency, localamount, localcurrency)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                                """)

    current_id = session.execute("SELECT MAX(doc_id) FROM transactions.transaction_data")[0].system_max_doc_id
    doc_id =  current_id + 1 if current_id else 0
    newFile = request.files['file'].read()
    csv_file = StringIO(newFile.decode("utf-8"))
    csv_reader = csv.reader(csv_file, delimiter=',')
    next(csv_reader) #skip header
    for row in csv_reader:
        session.execute_async(insert_stmt, [uuid.uuid4(), doc_id, row[2], row[7], float(row[8]), row[9], float(row[10]), row[11]])

    dict = {'Amount':[], 'Date':[], 'Category':[]}
    cql_query = "SELECT amount, date, category FROM transactions.transaction_data WHERE doc_id={} ALLOW FILTERING".format(doc_id)
    for row in session.execute(cql_query):
        dict['Amount'].append(row.amount)
        dict['Date'].append(row.date)
        dict['Category'].append(row.category)
    df = pd.DataFrame(dict)

    financial_health = round(compute_fin_health(df), 1)
    robustness_score = round(compute_robustness(df), 1)
    calculated_projections = compute_projections(df)
    projections = []
    for index, row in calculated_projections.iterrows():
        projection_dict = {}
        projection_dict[index] = []
        for name, value in row.items():
            projection_dict[index].append({'name': name, 'value': round(value, 2)})
        projections.append(projection_dict)

    finance_per_categories = []
    for category in  df['Category'].unique():
        for index, row in prepare_df(df.loc[df["Category"] == category]).iterrows():
            for name, value in row.items():
                finance_per_categories.append({'name': category, 'date': str(index), 'value': round(value, 2)})
    
    df_income = df.loc[df['Amount'] >= 0]
    df_expense = df.loc[df['Amount'] < 0]

    income_cats = df_income['Category'].unique()
    income_data = []
    for income_cat in income_cats:
        income_data.append({"name": income_cat, "value": round(df_income['Amount'][df_income['Category'] == income_cat].sum(), 2)})

    expense_data = []
    expense_cats = df_expense['Category'].unique()
    for expense_cat in expense_cats:
        expense_data.append({"name": expense_cat, "value": -round(df_expense['Amount'][df_expense['Category'] == expense_cat].sum(), 2)})

    response = {}
    response["original data"] = df.to_dict(orient='records')
    response["financial health"] = financial_health
    response["robustness score"] = robustness_score
    response["projections"] = projections
    response["income data"] = income_data
    response["expense data"] = expense_data
    response["finance per category"] = finance_per_categories

    res = jsonify(**response)
    res.headers.add("Access-Control-Allow-Origin", "*")

    return res

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001)
