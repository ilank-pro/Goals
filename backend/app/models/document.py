from app.extensions import db
from sqlalchemy.orm import relationship

class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    person_id = db.Column(db.Integer, db.ForeignKey('persons.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    html_link = db.Column(db.String(500), nullable=False)
    is_private = db.Column(db.Boolean, nullable=False, default=False)
    
    # Relationship
    person = relationship("Person", back_populates="documents")
    
    def __init__(self, person_id, name, description=None, html_link=None, is_private=False):
        self.person_id = person_id
        self.name = name
        self.description = description
        self.html_link = html_link
        self.is_private = is_private
    
    def to_dict(self):
        return {
            'id': self.id,
            'person_id': self.person_id,
            'name': self.name,
            'description': self.description,
            'html_link': self.html_link,
            'is_private': self.is_private
        } 