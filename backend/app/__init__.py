from flask import Flask
from flask_cors import CORS
from app.extensions import db
from app.routes.person_routes import person_bp
from app.routes.goal_routes import goal_bp
from app.routes.document_routes import document_bp

def create_app():
    # Create and configure the app
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    # Configure SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///goals.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(person_bp, url_prefix='/api/persons')
    app.register_blueprint(goal_bp, url_prefix='/api/goals')
    app.register_blueprint(document_bp, url_prefix='/api/documents')
    
    # Create database tables
    with app.app_context():
        db.create_all()
        
    return app 