from ember.person.views import Person, People, NewPerson
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls.defaults import patterns, url, include

urlpatterns = patterns('',
    url(r'^/(?P<pk>\d+)$', csrf_exempt(Person.as_view())),
    url(r'^/new/$', csrf_exempt(NewPerson.as_view())),
    url(r'^$', csrf_exempt(People.as_view())),
)
