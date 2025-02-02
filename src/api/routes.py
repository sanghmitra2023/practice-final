"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, redirect
from api.models import db, User, Dog, Favorite, Report, Appointment
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import os
import stripe
from flask_cors import cross_origin



api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def create_user():
    name = request.json.get("name", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({ "msg": "No password or email present." }), 400
    
    new_user = User(name=name, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    response_body = {
        "msg": "User created"
    }
    return jsonify(response_body), 201

@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    # Query your database for email and password
    user = User.query.filter_by(email=email, password=password).first()
    if user is None:
        # the user was not found on the database
        return jsonify({"msg": "Bad email or password"}), 401
    
    # create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id })

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    return jsonify({"id": user.id, "user": user.serialize() }), 200

@api.route('/dog', methods=['GET'])
def handle_get_all_dog():
    all_dog = Dog.query.all()
    print(all_dog)
    result = list(map(lambda item: item.serialize(), all_dog))
    return jsonify(result), 200

@api.route('/dog/<int:id>', methods=['GET'])
def handle_get_one_dog(id):
    dog = Dog.query.get(id)
    if dog:
        return jsonify (dog.serialize()), 200
    else:
        return jsonify ({"message" : "Dog not found"}), 404
    
@api.route('/favorite', methods=['GET'])
def handle_get_all_favorite():
    all_favorite = Favorite.query.all()
    print(all_favorite)
    result = list(map(lambda item: item.serialize(), all_favorite))
    return jsonify(result), 200

@api.route('/favorite/<int:id>', methods=['GET'])
def handle_get_one_favorite(id):
    favorite = Favorite.query.get(id)
    if favorite:
        return jsonify (favorite.serialize()), 200
    else:
        return jsonify ({"message" : "Favorite not found"}), 404
    
@api.route('/user/favorite/<int:id>', methods=['GET'])
def handle_user_favorites(id):
    user = User.query.get(id)
    if user:
        favorites = user.favorites
        return jsonify([favorite.serialize() for favorite in favorites])
    else:
        return jsonify({'message': 'User not found'}), 404
    
@api.route('/favorite/dog/<int:id>', methods=['POST'])
def create_favorite_dog(id):
    data = request.get_json() 
    user_id = data.get('id') 
    
    user = User.query.get(user_id)  
    if user:
        dog = Dog.query.get(id) 
        if dog:
            new_favorite = Favorite(dog_id=dog.id, user_id=user.id)
            db.session.add(new_favorite)
            db.session.commit()
            
            return jsonify({'message': 'Favorite dog added successfully.'}), 200
        else:
            return jsonify({'message': 'Dog not found'}), 404
    else:
        return jsonify({'message': 'User not found'}), 404
    
@api.route('/favorite/user/<int:id>/dog/<string:name>', methods=['DELETE'])
@cross_origin()
def delete_favorite_dog(id, name):
    
    user=User.query.get(id)
    print(user)
    if user is None: 
        return jsonify({"error":"User not Found"}), 404 
    dog=Dog.query.filter_by(name=name).first()
    print(dog)
    print(dog.id)
    if dog is None: 
        return jsonify({"error":"Dog not Found"}), 404
    favorites=Favorite.query.filter_by(user_id=id, dog_id=dog.id).first()
    print(id)
  
    print(favorites)
    if favorites is None: 
        return jsonify({"error":"No favorites yet!"}), 404
    db.session.delete(favorites)
    db.session.commit()
    return jsonify({"msg":"Favorite Dog Deleted"})
    
@api.route('/report', methods=['GET'])
def handle_get_all_report():
    all_report = Report.query.all()
    print(all_report)
    result = list(map(lambda item: item.serialize(), all_report))
    return jsonify(result), 200

@api.route('/report/<int:id>', methods=['GET'])
def handle_get_one_report(id):
    report = Report.query.get(id)
    if Report:
        return jsonify (report.serialize()), 200
    else:
        return jsonify ({"message" : "Report not found"}), 404
    
@api.route('/booking', methods=['POST'])
def create_appointment():
    user_id = request.json.get("user_id", None)
    dog_id = request.json.get("dog_id", None)
    time = request.json.get("time", None)
    user_comment = request.json.get("user_comment", None)

    if not user_id or not dog_id or not time or not user_comment:
        return jsonify({ "msg": "No dog_id or user_id or time or user_comment present." }), 400
    
    new_appointment = Appointment(user_id=user_id, dog_id=int(dog_id), time= time, user_comment=user_comment)
    db.session.add(new_appointment)
    db.session.commit()

    response_body = {
        "msg": "Appointment created"
    }
    return jsonify(response_body), 201

@api.route('/appointments', methods=['GET'])
def handle_appointments():

    appointments = Appointment.query.all()
    all_appointments = list(map(lambda x: x.serialize(), appointments))

    return jsonify(all_appointments), 200

@api.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    
    appointment1 = Appointment.query.get(appointment_id)
    if appointment1 is None:
        raise APIException('appointment not found', status_code=404)
    db.session.delete(appointment1)
    db.session.commit()
    appointments = Appointment.query.all()
    all_appointments = list(map(lambda x: x.serialize(), appointments))
    
    return jsonify(all_appointments), 200

# This is your test secret API key.
# print(os.getenv('SECRET_KEY'))
stripe.api_key = os.getenv('SECRET_KEY')

@api.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                    'name': 'We-Time Session',
                    },
                    'unit_amount': 50,
                },
                'quantity': 1,
                }],
            mode='payment',
            success_url='https://organic-space-invention-wwrjggpr69vcv454-3000.app.github.dev/success',
            cancel_url='https://organic-space-invention-wwrjggpr69vcv454-3000.app.github.dev/canceled',
        )
    except Exception as e:
        return str(e)

    return redirect(checkout_session.url, code=303)

if __name__ == '__main__':
    api.run(port=4242)




# this only runs if `$ python src/app.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    api.run(host='0.0.0.0', port=PORT, debug=False)

