from flask import Blueprint, request, jsonify
from app import db
from app.models.person import Person

person_bp = Blueprint('person_bp', __name__)

@person_bp.route('/', methods=['GET'])
def get_all_persons():
    """Get all persons in the organization"""
    persons = Person.query.all()
    return jsonify([person.to_dict() for person in persons]), 200

@person_bp.route('/tree', methods=['GET'])
def get_org_tree():
    """Get the organizational tree structure"""
    tree = Person.get_org_tree()
    return jsonify(tree), 200

@person_bp.route('/<int:person_id>', methods=['GET'])
def get_person(person_id):
    """Get a specific person by ID"""
    person = Person.query.get_or_404(person_id)
    return jsonify(person.to_dict()), 200

@person_bp.route('/', methods=['POST'])
def create_person():
    """Create a new person in the organization"""
    data = request.get_json()
    
    if not data or 'name' not in data or 'position' not in data:
        return jsonify({'error': 'Name and position are required'}), 400
    
    # Create new person
    new_person = Person(
        name=data['name'],
        position=data['position'],
        parent_id=data.get('parent_id')  # Optional parent ID
    )
    
    db.session.add(new_person)
    db.session.commit()
    
    return jsonify(new_person.to_dict()), 201

@person_bp.route('/<int:person_id>', methods=['PUT'])
def update_person(person_id):
    """Update an existing person"""
    person = Person.query.get_or_404(person_id)
    data = request.get_json()
    
    if 'name' in data:
        person.name = data['name']
    if 'position' in data:
        person.position = data['position']
    if 'parent_id' in data:
        person.parent_id = data['parent_id']
    
    db.session.commit()
    
    return jsonify(person.to_dict()), 200

@person_bp.route('/<int:person_id>', methods=['DELETE'])
def delete_person(person_id):
    """Delete a person from the organization"""
    person = Person.query.get_or_404(person_id)
    
    # Update subordinates to have no parent (or could reassign them)
    for subordinate in person.subordinates:
        subordinate.parent_id = None
    
    db.session.delete(person)
    db.session.commit()
    
    return jsonify({'message': 'Person deleted successfully'}), 200

@person_bp.route('/<int:person_id>/subordinates', methods=['GET'])
def get_subordinates(person_id):
    """Get all direct subordinates of a person"""
    person = Person.query.get_or_404(person_id)
    return jsonify([subordinate.to_dict() for subordinate in person.subordinates]), 200 