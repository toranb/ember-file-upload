from rest_framework.serializers import ModelSerializer
from ember.person.models import Person

class PersonSerializer(ModelSerializer):
    class Meta(object):
        model = Person
        fields = ('id', 'username', 'attachment')
