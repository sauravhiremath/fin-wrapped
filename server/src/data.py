import json
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from dotenv import load_dotenv
from algos import compute_fin_health, compute_robustness, compute_projections
import pandas as pd
import csv
import uuid
import os

load_dotenv()

def generate_database(user):

    DOC_ID = -1
    FILE_PATH = ''
    if user == 'pizza':
        DOC_ID = 1
        FILE_PATH = './datasets/Pizza_Takeaway_Dataset.csv'
    if user == 'hairdresser':
        DOC_ID = 0
        FILE_PATH = './datasets/Hairdressers_Dataset.csv'
    
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

    with open(FILE_PATH, 'r') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        next(csv_reader) #skip header
        for row in csv_reader:
            session.execute_async(insert_stmt, [uuid.uuid4(), DOC_ID, row[2], row[7], float(row[8]), row[9], float(row[10]), row[11]])
            print("current progress", row[0])

def generate_response(user):

    DOC_ID = -1

    if user == 'pizza':
        DOC_ID = 1
    if user == 'hairdresser':
        DOC_ID = 0

    cloud_config= {'secure_connect_bundle': os.environ['SECURE_CONNECT_PATH']}
    auth_provider = PlainTextAuthProvider(os.environ['DATABASE_USER'], os.environ['DATABASE_PASSWORD'])
    cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
    session = cluster.connect()
    session.set_keyspace('transactions')

    dict = {'Amount':[], 'Date':[], 'Category':[]}
    cql_query = "SELECT amount, date, category FROM transactions.transaction_data WHERE doc_id={} ALLOW FILTERING".format(DOC_ID)
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
    finance_cats = df['Category'].unique()
    for finance_cat in finance_cats:
        finance_dict = {}
        finance_dict[finance_cat] = []
        sub_df = df.loc[df['Category'] == finance_cat]
        sub_df['Month'] = sub_df['Date'].str.slice(0, 7).copy()
        months = sorted(sub_df['Month'].unique())
        for month in months:
            finance_dict[finance_cat].append({'date':month, 'amount': round(sub_df['Amount'][sub_df['Month'] == month].sum(), 2)})
        finance_per_categories.append(finance_dict)
    
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

    with open(user + '.json', 'w') as f:
        json.dump(response, f)

if __name__ == "__main__":

    # generate_database('pizza')
    # generate_database('hairdresser')
    generate_response('pizza')
    generate_response('hairdresser')
