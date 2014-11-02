import json
import requests
from math import sin, cos, sqrt, atan2, radians

postcodes = {}
session = None
guildhallLat = lat1 = radians(51.3819766)
guildhallLon = lon1 = radians(-2.3587489)
R = 6371.0

def looksLikePostcode(postcode):
    return len(postcode) > 0 and len(postcode) <= 9 and " " in postcode


def getCoords(postcode):
    global session
    global postcodes

    if not session:
        session = requests.Session()

    response = session.get("http://api.postcodes.io/postcodes/" + postcode)
    outjson = response.json()

    latitude = 0
    longitude = 0

    if outjson["status"] == 200:
        postcodes[postcode] = {}

        latitude = outjson["result"]["latitude"]
        longitude = outjson["result"]["longitude"]

        postcodes[postcode]["latitude"] = latitude or 0
        postcodes[postcode]["longitude"] = longitude or 0

    return (latitude, longitude)


def getDistance(postcode):
    try:
        lon2 = radians(postcodes[postcode]["longitude"])
        lat2 = radians(postcodes[postcode]["latitude"])

        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = (sin(dlat/2))**2 + cos(lat1) * cos(lat2) * (sin(dlon/2))**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        distance = R * c
    except:
        print("ERROR >>>>>>>>>>>>>")
        print(postcode, postcodes[postcode])
        print("<<<<<<<<<<<<<<<<<<<")
        pass

    return round(distance, 2)


def postcodeize():
    global postcode

    with open("companies.json", "r") as f:
        companies = json.load(f)

    isvalid = companycount = 0

    for company in companies:
        if "address" in company:
            address = company["address"]
            parts = address.split(",")

            postcode = parts[-1].strip()

            if looksLikePostcode(postcode):
                company["postcode"] = postcode

                if postcode in postcodes:
                    latitude = postcodes[postcode]["latitude"]
                    longitude = postcodes[postcode]["longitude"]
                else:
                    latitude, longitude = getCoords(postcode)

                company["latitude"] = latitude
                company["longitude"] = longitude

                if latitude == 0 and longitude == 0:
                    company["distance"] = 0
                else:
                    company["distance"] = getDistance(postcode)

                print(company)

                isvalid += 1
        companycount += 1

    print(isvalid, companycount)
    with open("companies_distances.json", "wb") as f:
        json.dump(companies, f, indent=2)

if __name__ == "__main__":
    postcodeize()
