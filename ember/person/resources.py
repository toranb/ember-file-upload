from djangorestframework.resources import ModelResource
from ember.person.models import Person

class PersonResource(ModelResource):
    model = Person
    fields = ('id', 'username', 'attachment')
