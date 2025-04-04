import json
import random
from datetime import datetime, timedelta

# Categories for expenses and income
categories = {
    "income": ["Salary", "Freelance", "Bonus", "Investments", "Business"],
    "expense": ["Food", "Rent", "Transport", "Utilities", "Entertainment", "Healthcare", "Shopping", "Other"]
}

# Generate 1000+ transactions
transactions = []
start_date = datetime(2020, 1, 1)
for _ in range(100):
    type_choice = random.choice(["income", "expense"])
    category = random.choice(categories[type_choice])
    
    # Generate a random amount
    amount = round(random.uniform(50, 10000), 2) if type_choice == "income" else round(random.uniform(5, 2000), 2)
    
    # Randomize date within the last 3 months
    date = start_date + timedelta(days=random.randint(0, 90))
    
    transactions.append({
        "Description": category,
        "Amount": amount,
        "Type": type_choice,
        "Category": category,
        "Date": date.strftime("%Y-%m-%d")
    })

# Save to JSON file
with open("finance_data.json", "w") as json_file:
    json.dump(transactions, json_file, indent=4)

print("finance_data.json created successfully!")
