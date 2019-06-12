from flask import Flask, request, jsonify
app = Flask(__name__)

import requests
import json

from geopy.distance import great_circle
from math import radians, cos, sin, asin, sqrt

def get_postcode_lat_lng(postcode):
    r = requests.get("http://api.postcodes.io/postcodes/{}".format(postcode)).text
    data = json.loads(r)
    return (float(data["result"]["latitude"]), float(data["result"]["longitude"]))


@app.route('/api/postcodes/singledistance/<p1>/<p2>')
def calculate_postcode_distance(p1, p2):
    p1_latlng = get_postcode_lat_lng(p1)
    p2_latlng = get_postcode_lat_lng(p2)
    
    distance = great_circle(p1_latlng, p2_latlng)
    return str((round(distance.miles,3), round(distance.km,3)))


@app.route('/api/postcodes/batchdistance', methods=['POST'])
def calculate_batch_postcode_distance():
    obj = request.get_json(force=True)
    reference_postcode = obj['reference_postcode']
    test_postcode_list = obj['test_postcode_list']
    
    latlng_init = get_postcode_lat_lng(reference_postcode)
    r = requests.post('http://api.postcodes.io/postcodes', data = {'postcodes':test_postcode_list}).text
    data = json.loads(r)
    distance_list = []

    for result_item in data["result"]:
        if result_item["result"] is None:
            distance_item = result_item["query"], None
        else:
            distance = great_circle(latlng_init, (float(result_item["result"]["latitude"]), float(result_item["result"]["longitude"])))
            distance_item = result_item["query"], round(distance.miles, 3), round(distance.km, 3)
        distance_list.append(distance_item)

    return str(distance_list)


