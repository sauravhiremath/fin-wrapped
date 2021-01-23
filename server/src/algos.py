"""
Algorithm functions for use in FinWrapped
"""

import pandas as pd

import math

INIT_AMT = 5000

def estimate_rate(df, alpha=0.75):
    """Assumes df is a dataframe with only one column and proper indexing"""
    rates = df.diff() / df
    return rates.ewm(alpha=alpha).mean().iloc[-1,0]


def prepare_df(df):
    new_df = df.copy()

    new_df['Date'] = pd.to_datetime(new_df['Date'])
    new_df.index = new_df['Date']
    return new_df.groupby(pd.Grouper(freq='M')).sum()


def sigmoid(num):
    return 1 / (1 + math.exp(-num))


def get_income_expenses(df):
    df_restr = df[['Date', 'Category', 'Amount']]
    income = df_restr[df_restr['Amount'] > 0]
    expenses = df_restr[df_restr['Amount'] < 0]
    return income, expenses


def compute_fin_health(df):
    income, expenses = get_income_expenses(df)

    income = prepare_df(income)
    expenses = prepare_df(expenses)
    income_rate = estimate_rate(income)
    expenses_rate = estimate_rate(expenses)

    if income_rate > 0:
        return 100. * sigmoid(1 - expenses_rate/income_rate)
    else:
        return 100. * sigmoid(1 - income_rate/expenses_rate)



def estimate_survivability(df, init_amt=INIT_AMT):
    income, expenses = get_income_expenses(df)

    ttl_income = income['Amount'].sum()
    ttl_expenses = expenses['Amount'].sum()
    bankroll = init_amt + ttl_expenses + ttl_income # expenses are negative

    expense_by_month = prepare_df(expenses)
    last_mo_expense = expense_by_month.iloc[-1,0]

    return max(0, -bankroll/last_mo_expense) # expenses are negative


def compute_robustness(df, init_amt=INIT_AMT):
    surv = estimate_survivability(df, init_amt)
    return 100*(1 - math.exp(-surv))
