from flask import Flask, request, jsonify, render_template
app = Flask(__name__)

import requests
import json

from geopy.distance import great_circle

@app.route('/about')
def render_about():
	return render_template("about.html")

@app.route('/postcodes')
def render_postcode_tools():
	return render_template("postcode_tools.html")

def get_postcode_lat_lng(postcode):
    r = requests.get("http://api.postcodes.io/postcodes/{}".format(postcode)).text
    data = json.loads(r)
    return (float(data["result"]["latitude"]), float(data["result"]["longitude"]))


@app.route('/api/postcodes/singledistance/<p1>/<p2>')
def calculate_postcode_distance(p1, p2):
    latlng_p1 = get_postcode_lat_lng(p1)
    latlng_p2 = get_postcode_lat_lng(p2)
    
    distance = great_circle(latlng_p1, latlng_p2)
    return "{},{}".format(round(distance.miles,3), round(distance.km,3))


@app.route('/api/postcodes/batchdistance', methods=['POST'])
def calculate_batch_postcode_distance():
	obj = request.get_json(force=True)
	reference_postcode = obj['reference_postcode']
	test_postcode_list = obj['test_postcode_list']

	latlng_init = get_postcode_lat_lng(reference_postcode)
	print(test_postcode_list)
	r = requests.post('http://api.postcodes.io/postcodes', data = {'postcodes':test_postcode_list}).text
	data = json.loads(r)
	distance_list = {}

	for result_item in data["result"]:
		if result_item["result"] is None:
			distance_list[result_item["query"]] = None
		else:
			distance = great_circle(latlng_init, (float(result_item["result"]["latitude"]), float(result_item["result"]["longitude"])))
			distance_list[result_item["query"]] = {"miles": round(distance.miles, 3), "km": round(distance.km, 3)}

	return jsonify(distance_list)


