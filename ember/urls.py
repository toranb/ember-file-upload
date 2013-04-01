from django.conf.urls import patterns, include, url
from ember.person.views import HomeView

urlpatterns = patterns('',
    url(r'^people', include('ember.person.urls', namespace='person')),
    url(r'^$', HomeView.as_view()),
)
