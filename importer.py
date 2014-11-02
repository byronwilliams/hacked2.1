import json
import csv
import os
import datetime
import re
import bson


DATEFMT = "%Y-%m-%dT00:00:00+00:00"

def run_import():
    files = os.listdir("data")

    docs = []

    for f in files:
        with open("data/" + f, "rb") as csvfile:
            reader = csv.reader(csvfile)

            fields = []
            print(f)

            for idx, item in enumerate(reader):
                if idx == 0:
                    fields = [x.replace(" ", "") for x in item]
                    print(fields)
                else:
                    doc = dict(zip(fields, item))

                    if len(doc["Amount"]):
                        doc["Amount"] = float(re.sub("[^0-9\.]", "", doc["Amount"]))

                    if "Date" in doc.keys():
                        date_parts = doc["Date"].split("/")
                        date_parts.reverse()

                        if len(date_parts[0]) == 2:
                            date_parts[0] = "20" + date_parts[0]

                        if len(date_parts) == 3:
                            doc["Year"] = date_parts[0]
                            doc["Month"] = date_parts[1]

                    elif "Payment Date" in doc.keys():
                        date_parts = doc["Payment Date"].split("/")
                        date_parts.reverse()

                        if len(date_parts[0]) == 2:
                            date_parts[0] = "20" + date_parts[0]

                        if len(date_parts) == 3:
                            doc["Year"] = date_parts[0]
                            doc["Month"] = date_parts[1]

                    doc["Votes"] = 0
                    docs.append(doc)

    with open("out.json", "w") as outf:
        json.dump(docs, outf, indent=2)



if __name__ == "__main__":
    run_import()
