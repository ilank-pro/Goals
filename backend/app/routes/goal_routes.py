from flask import Blueprint, request, jsonify
from app import db
from app.models.goal import Goal
from app.models.person import Person

goal_bp = Blueprint('goal_bp', __name__)

@goal_bp.route('/', methods=['GET'])
def get_all_goals():
    """Get all goals in the system"""
    goals = Goal.query.all()
    return jsonify([goal.to_dict() for goal in goals]), 200

@goal_bp.route('/<int:goal_id>', methods=['GET'])
def get_goal(goal_id):
    """Get a specific goal by ID"""
    goal = Goal.query.get_or_404(goal_id)
    return jsonify(goal.to_dict()), 200

@goal_bp.route('/person/<int:person_id>', methods=['GET'])
def get_person_goals(person_id):
    """Get all goals for a specific person"""
    Person.query.get_or_404(person_id)  # Verify person exists
    goals = Goal.query.filter_by(person_id=person_id).all()
    return jsonify([goal.to_dict() for goal in goals]), 200

@goal_bp.route('/', methods=['POST'])
def create_goal():
    """Create a new goal for a person"""
    data = request.get_json()
    
    if not data or 'person_id' not in data or 'name' not in data:
        return jsonify({'error': 'Person ID and goal name are required'}), 400
    
    # Verify person exists
    Person.query.get_or_404(data['person_id'])
    
    # Create new goal
    new_goal = Goal(
        person_id=data['person_id'],
        name=data['name'],
        definition=data.get('definition'),
        target=data.get('target', 0),
        current_value=data.get('current_value', 0),
        is_locked=data.get('is_locked', False),
        is_private=data.get('is_private', False)
    )
    
    db.session.add(new_goal)
    db.session.commit()
    
    # Propagate changes upward in the hierarchy
    # Only if the goal is not private
    if not new_goal.is_private:
        Goal.propagate_goal_changes(new_goal.id)
    
    return jsonify(new_goal.to_dict()), 201

@goal_bp.route('/<int:goal_id>', methods=['PUT'])
def update_goal(goal_id):
    """Update an existing goal"""
    goal = Goal.query.get_or_404(goal_id)
    data = request.get_json()
    
    # Store the original private status to check if it changed
    was_private = goal.is_private
    
    if 'name' in data:
        goal.name = data['name']
    if 'definition' in data:
        goal.definition = data['definition']
    if 'target' in data:
        goal.target = data['target']
    if 'current_value' in data:
        goal.current_value = data['current_value']
    if 'is_locked' in data:
        goal.is_locked = data['is_locked']
    if 'is_private' in data:
        goal.is_private = data['is_private']
    
    db.session.commit()
    
    # Propagate changes upward in the hierarchy only if the goal is not private
    # If the goal was changed from private to public, we need to propagate
    if not goal.is_private or (was_private and not goal.is_private):
        Goal.propagate_goal_changes(goal.id)
    
    return jsonify(goal.to_dict()), 200

@goal_bp.route('/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    """Delete a goal"""
    goal = Goal.query.get_or_404(goal_id)
    
    # Store person_id before deleting for propagation
    person_id = goal.person_id
    goal_name = goal.name
    is_private = goal.is_private
    
    db.session.delete(goal)
    db.session.commit()
    
    # Only propagate if the goal was not private
    if not is_private:
        # Find the person and parent to handle propagation
        person = Person.query.get(person_id)
        if person and person.parent_id:
            parent = Person.query.get(person.parent_id)
            if parent:
                parent_goal = Goal.query.filter_by(person_id=parent.id, name=goal_name).first()
                if parent_goal:
                    Goal.propagate_goal_changes(parent_goal.id)
    
    return jsonify({'message': 'Goal deleted successfully'}), 200 