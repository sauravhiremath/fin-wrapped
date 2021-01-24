CREATE TABLE IF NOT EXISTS transactions.transaction_data
(
    id UUID PRIMARY KEY,
    doc_id int,
    transactionid UUID,
    date TEXT,
    time TEXT,
    type TEXT,
    name TEXT,
    emoji TEXT,
    category TEXT,
    amount DOUBLE,
    currency TEXT,
    localamount DOUBLE,
    localcurrency TEXT,
    notesandtags TEXT,
    address TEXT,
    receipt TEXT,
    description TEXT,
    categorysplit TEXT,
    moneyout DOUBLE,
    moneyin DOUBLE
);
