from pymongo import MongoClient

def seed_accounts(mongo_uri="mongodb://admin:secret@localhost:27017/dashboardDB?authSource=admin", db_name="dashboardDB"):
    """
    Seeds the 'accounts' collection with predefined master data.

    Args:
        mongo_uri (str): MongoDB connection URI.
        db_name (str): Name of the database to use.
    """
    client = MongoClient(mongo_uri)
    db = client[db_name]
    accounts_collection = db["accounts"]

    # Master data
    accounts_data = [
        {
            "account_id": "ACC-hyg-e7a800",
            "account_type": "hyg",
            "instances": [
                {"account_instance": "production", "instance_id": "1068561"},
                {"account_instance": "development", "instance_id": "1068671"},
                {"account_instance": "uat", "instance_id": "1068677"},
                {"account_instance": "train", "instance_id": "1068682"}
            ]
        },
        {
            "account_id": "ACC-mee-e60012",
            "account_type": "mee",
            "instances": [
                {"account_instance": "production", "instance_id": "3433667"},
                {"account_instance": "development", "instance_id": "1068671"},
                {"account_instance": "uat", "instance_id": "3435605"},
                {"account_instance": "train", "instance_id": "3431714"}
            ]
        },
        {
            "account_id": "ACC-ame-124D75",
            "account_type": "ame",
            "instances": [
                {"account_instance": "sandbox", "instance_id": "463836"},
                {"account_instance": "development", "instance_id": "0oaftrncm3swqV8Gp2p7"},
                {"account_instance": "uat", "instance_id": "0oafts1nlwbMn2i6y2p7"},
                {"account_instance": "train", "instance_id": "0oagnu9hvvJNpWg0U2p7"},
                {"account_instance": "production", "instance_id": "0oagzb4bncIKrwL0u2p7"}
            ]
        },
        {
            "account_id": "ACC-nttdata-e7a800",
            "account_type": "nttdata",
            "instances": [
                {"account_instance": "production", "instance_id": "421801"},
                {"account_instance": "development", "instance_id": "423045"},
                {"account_instance": "uat", "instance_id": "424395"},
                {"account_instance": "train", "instance_id": "427884"},
                {"account_instance": "sandbox", "instance_id": "463836"}
            ]
        },
        {
            "account_id": "ACC-alter-e74315",
            "account_type": "alter",
            "instances": [
                {"account_instance": "sbx", "instance_id": "1577180"},
                {"account_instance": "dev", "instance_id": "1577185"},
                {"account_instance": "uat", "instance_id": "1577186"},
                {"account_instance": "train", "instance_id": "1577189"},
                {"account_instance": "prod", "instance_id": "1577193"}
            ]
        },
        {
            "account_id": "ACC-demo-124D75",
            "account_type": "demo",
            "instances": [
                {"account_instance": "demo", "instance_id": "854816"}
            ]
        }
    ]

    # Clear existing data
    accounts_collection.delete_many({})

    # Insert new data
    accounts_collection.insert_many(accounts_data)

    print("Seed data inserted into 'accounts' collection.")


# Optional: run directly
if __name__ == "__main__":
    seed_accounts()
