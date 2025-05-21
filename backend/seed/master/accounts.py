from pymongo import MongoClient
import base64
import os

def encode_image_to_base64(path):
    """
    Converts an image file to a base64 string without MIME prefix.

    Args:
        path (str): Path to the image file.
    
    Returns:
        str: Base64 encoded string.
    """
    with open(path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def seed_accounts(mongo_uri="mongodb://localhost:27017/", db_name="dashboardDB", logo_dir="./logos"):
    client = MongoClient(mongo_uri)
    db = client[db_name]
    accounts_collection = db["accounts"]

    # Mapping account_type → image filename
    logo_mapping = {
        "hyg": "hyster_yale_group.png",
        "mitsubishielectric": "mitsubishi_electric.png",
        "alterdomus": "alter_domus.png",
        "nttdata": "nttdata.png",
        "nttdataservicesdemo02": "nttdata_demo.png"
    }

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
            "account_type": "mitsubishielectric",
            "instances": [
                {"account_instance": "production", "instance_id": "3433667"},
                {"account_instance": "development", "instance_id": "1068671"},
                {"account_instance": "uat", "instance_id": "3435605"},
                {"account_instance": "train", "instance_id": "3431714"}
            ]
        },
        {
            "account_id": "ACC-ame-124D75",
            "account_type": "nttdata",
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
            "account_type": "alterdomus",
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
            "account_type": "nttdataservicesdemo02",
            "instances": [
                {"account_instance": "demo", "instance_id": "854816"}
            ]
        }
    ]

    # Add logo to each account record
    for account in accounts_data:
        acc_type = account["account_type"]
        filename = logo_mapping.get(acc_type)
        if filename:
            image_path = os.path.join(logo_dir, filename)
            if os.path.exists(image_path):
                base64_image = encode_image_to_base64(image_path)
                account["logo"] = {
                    "name": acc_type,
                    "image": base64_image
                }
            else:
                print(f"[WARNING] Logo not found for {acc_type} at {image_path}")
        else:
            print(f"[WARNING] No logo mapping for account type: {acc_type}")

    # Clear existing data
    accounts_collection.delete_many({})

    # Insert new data
    accounts_collection.insert_many(accounts_data)

    print("Seed data with logos inserted into 'accounts' collection.")

if __name__ == "__main__":
    seed_accounts()
