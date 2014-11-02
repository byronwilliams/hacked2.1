import json

def merge():
    with open("companies_distances.json", "r") as cd:
        distances = json.load(cd)

    with open("out.json", "r") as ts:
        transactions = json.load(ts)

    distance_dict = {}

    for d in distances:
        if "name" in d:
            d["name"] = d["name"].replace("LTD", "LIMITED").upper()
            distance_dict[d["name"]] = d

    for t in transactions:
        sName = t["SupplierName"].replace("LTD", "LIMITED").upper()
        if sName in distance_dict:
            d = distance_dict[sName]
            for k in d.keys():
                if k != "name":
                    t[k] = d[k]

    cores = 4
    perCore = int(len(transactions) / cores)

    for iteration in range(0, cores):
        start = iteration*perCore
        end = (iteration+1)*perCore
        print(start,end)

        with open("all{}.json".format(iteration), "wb") as outf:
            json.dump(transactions[start:end], outf, indent=2)


if __name__ == "__main__":
    merge()
