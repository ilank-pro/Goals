from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app():
    # Create and configure the app
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    # Configure SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.dirname(os.path.abspath(__file__)), 'org_structure.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints
    from app.routes.person_routes import person_bp
    from app.routes.goal_routes import goal_bp
    
    app.register_blueprint(person_bp, url_prefix='/api/persons')
    app.register_blueprint(goal_bp, url_prefix='/api/goals')
    
    # Create database tables
    with app.app_context():
        db.create_all()
        
    return app 