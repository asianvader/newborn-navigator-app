from flask import Flask, jsonify, request
from db import create_tables
from werkzeug.security import check_password_hash, generate_password_hash
import baby_tracker_controller
from datetime import datetime, timedelta, timezone
import json
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
import os
from dotenv import load_dotenv


def configure():
    load_dotenv()


app = Flask(__name__)

jwt_secret_key = os.getenv('JWT_SECRET_KEY')
app.config["JWT_SECRET_KEY"] = jwt_secret_key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt = JWTManager(app)


@app.route('/register', methods=['POST'])
def register():
    user_details = request.get_json()
    username = user_details['username']
    password = user_details['password']
    hashed_password = generate_password_hash(password)

    # Check if user already exists
    check_user_exists = baby_tracker_controller.check_user(username)
    if len(check_user_exists) > 0:
        response = {'message': 'User already exists'}
        return jsonify(response)
    else:
        # If not, add user to db
        result = baby_tracker_controller.insert_user(username, hashed_password)
        response = {'message': 'User added'}
        return jsonify(response)


@app.route('/login/<username>/<password>', methods=['GET'])
def login(username, password):
    # Check db
    result = baby_tracker_controller.check_user(username)
    # Ensure username exists and password is correct
    if len(result) != 1:
        response = {
            'message': "no username"}
        return jsonify(response)
    elif not check_password_hash(result[0]["hash"], password):
        response = {
            'message': "wrong password"}
        return jsonify(response)
    else:
        # Create access token
        access_token = create_access_token(identity=username)
        # Return token to the client
        response = {"access_token": access_token}
        return jsonify(response)


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route("/main-menu/<username>", methods=["GET"])
@jwt_required()
def main_menu(username):
    # Get userid
    user_details = baby_tracker_controller.check_user(username)
    id = user_details[0]["id"]
    children = baby_tracker_controller.check_baby_info(id)
    if len(children) > 0:
        return jsonify(children)
    else:
        return jsonify({'message': 'no children', 'id': id})


@app.route("/add-baby", methods=["POST"])
@jwt_required()
def add_baby():
    baby_details = request.get_json()
    name = baby_details["name"]
    dob = baby_details["dob"]
    id = baby_details["id"]
    add_bb = baby_tracker_controller.add_baby(name, dob, id)
    if add_bb:
        return jsonify({'message': 'Successfully added baby'})


@app.route("/add-feed", methods=["POST"])
# @jwt_required()
def add_feed():
    feed_details = request.get_json()
    name = feed_details["name"]
    date = feed_details["date"]
    id = feed_details["id"]
    activity = feed_details["activity"]
    information = feed_details["information"]
    feed = baby_tracker_controller.log_activity(
        activity, name, id, date, information)
    if feed:
        return jsonify({'message': 'Successfully added feed'})


@app.route("/add-sleep", methods=["POST"])
@jwt_required()
def add_sleep():
    sleep_details = request.get_json()
    name = sleep_details["name"]
    date = sleep_details["date"]
    id = sleep_details["id"]
    activity = sleep_details["activity"]
    information = sleep_details["information"]
    sleep = baby_tracker_controller.log_activity(
        activity, name, id, date, information)
    if sleep:
        return jsonify({'message': 'Successfully added sleep'})


@app.route("/add-nappy", methods=["POST"])
@jwt_required()
def add_nappy():
    nappy_details = request.get_json()
    name = nappy_details["name"]
    date = nappy_details["date"]
    id = nappy_details["id"]
    activity = nappy_details["activity"]
    information = nappy_details["information"]
    nappy = baby_tracker_controller.log_activity(
        activity, name, id, date, information)
    if nappy:
        return jsonify({'message': 'Successfully added nappy'})


@app.route("/activity-history/<id>/<baby>/<activity>", methods=["GET"])
@jwt_required()
def activity_history(id, baby, activity):
    user_id = int(id)
    results = baby_tracker_controller.get_activity_history(
        user_id, baby, activity)
    return jsonify(results)


@app.after_request
def after_request(response):
    # <- You can change "*" for a domain for example "http://localhost"
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"

    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


if __name__ == "__main__":
    create_tables()
    app.run(debug=False)
