"""
Algorithm functions for use in FinWrapped
"""

import numpy as np
import pandas as pd

import math

INIT_AMT = 5000
PERIODS = 6
ALPHA = 0.15

def estimate_rate(df, alpha=ALPHA):
    """Assumes df is a dataframe with only one column and proper indexing"""
    rates = df.diff() / df
    return rates.ewm(alpha=alpha).mean().iloc[-1,0]


def prepare_df(df):
    new_df = df.copy()

    new_df['Date'] = pd.to_datetime(new_df['Date'])
    new_df.index = new_df['Date']
    return new_df.groupby(pd.Grouper(freq='M')).sum()


def sigmoid(num):
    return 1 / (1 + np.exp(-num))


def get_income_expenses(df):
    df_restr = df[['Date', 'Category', 'Amount']]
    income = df_restr[df_restr['Amount'] > 0]
    expenses = df_restr[df_restr['Amount'] < 0]
    return income, expenses

def fin_health_formula(income_rate, expenses_rate):
    return 100. * sigmoid(1.5 * (income_rate-expenses_rate))

def compute_fin_health(df):

    income, expenses = get_income_expenses(df)
    income = prepare_df(income)
    expenses = prepare_df(expenses)
    income_rate = estimate_rate(income)
    expenses_rate = estimate_rate(expenses)

    return fin_health_formula(income_rate, expenses_rate)


def estimate_survivability(df, init_amt=INIT_AMT):
    income, expenses = get_income_expenses(df)

    ttl_income = income['Amount'].sum()
    ttl_expenses = expenses['Amount'].sum()
    bankroll = init_amt + ttl_expenses + ttl_income # expenses are negative

    expense_by_month = prepare_df(expenses)
    last_mo_expense = expense_by_month.iloc[-1,0]

    return max(0., -bankroll/last_mo_expense) # expenses are negative

def robustness_formula(surv):
    return 100*(1 - np.exp(-surv/5))

def compute_robustness(df, init_amt=INIT_AMT):
    surv = estimate_survivability(df, init_amt)
    return robustness_formula(surv)

def get_terminal_val(df):
    return df.iloc[-3:-1,0].mean()


def project_series(df, periods=PERIODS):
    rates = estimate_rate(df) + np.ones(periods)
    projections = np.ones_like(rates)

    terminal_val = get_terminal_val(df)
    projections[0] = terminal_val * rates[0]

    for i in range(1, len(rates)):
        projections[i] = projections[i-1] * rates[i]

    return projections


def project_category(df, category, periods=PERIODS):
    categ_df = df[['Date', 'Category', 'Amount']]
    categ_df = categ_df[categ_df['Category'] == category]
    categ_df = prepare_df(categ_df)
    return project_series(categ_df, periods)


def compute_categ_projections(df, periods=PERIODS, init_bank_amt=INIT_AMT):
    categs = df['Category'].unique()
    categ_proj = {categ: project_category(df, categ, periods)
                  for categ in categs}
    return pd.DataFrame(categ_proj)


def compute_projections(df, periods=PERIODS, init_bank_amt=INIT_AMT, alpha=ALPHA):
    preds = compute_categ_projections(df, periods, init_bank_amt)
    preds['Total Income'] = preds[preds > 0].sum(axis=1)
    preds['Total Expenses'] = preds[preds < 0].sum(axis=1)
    preds['Net Income'] = preds['Total Income'] + preds['Total Expenses']
    preds['Bank Value'] = preds['Net Income'].cumsum() + init_bank_amt

    surv = -preds['Bank Value']/preds['Total Expenses']
    surv[surv < 0] = 0
    preds['Robustness Score'] = robustness_formula(surv)

    income, expenses = get_income_expenses(df)
    income = prepare_df(income)
    expenses = prepare_df(expenses)
    income_stacked = pd.DataFrame(np.append(income['Amount'], preds['Total Income'].values))
    expenses_stacked = pd.DataFrame(np.append(expenses['Amount'], preds['Total Income'].values))
    inc_rates = (income_stacked.diff()/income_stacked).ewm(alpha=alpha).mean().iloc[-periods:].values
    exp_rates = (expenses_stacked.diff()/expenses_stacked).ewm(alpha=alpha).mean().iloc[-periods:].values
    preds['Financial Health'] = fin_health_formula(inc_rates, exp_rates)

    preds.index = pd.Index([i for i in range(1, periods+1)])

    return preds
