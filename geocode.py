import requests
import urllib
import time
import random
import json

CK_APIKEY = "d04d20b5c7aa4566225f3f7fb977470bb73ff432df71aaac9217215b806d"
CK_BASICURL = "https://companycheck.co.uk/api/json/search?name={0}&apiKey={1}"


def geocode():
    response = requests.get("http://localhost:8080/api/ltdcompanies/")

    s = requests.Session()

    out = []

    for company in response.json():
        try:
            req_url = CK_BASICURL.format(urllib.quote(company), CK_APIKEY)
            print(req_url)
            req = s.get(req_url)
            res = req.json()

            out += res

            time.sleep(random.random())
        except:
            print(company + " failed")

    with open("companies.json", "wb") as outf:
        json.dump(out, outf)

if __name__ == "__main__":
    geocode()
