from django.views.generic import TemplateView
from ember.person import resources
from django.views.generic import edit
from django.views.generic import base
from django.views.generic import list
from django.template import context
from django import shortcuts
from django import forms
from ember.person import models
from rest_framework import generics


class PersonForm(forms.ModelForm):
    username = forms.CharField(max_length=50)
    attachment = forms.FileField()

    class Meta:
        model = models.Person
        fields = ('username', 'attachment', )

class HomeView(TemplateView):
    template_name = 'index.html'

class NewPerson(edit.BaseCreateView, list.BaseListView, base.TemplateResponseMixin):
    template_name = 'index.html'
    model = models.Person
    form_class = PersonForm

    def post(self, request, *args, **kwargs):
        form_data = self.get_form_post_data(request, *args, **kwargs)
        return self.build_and_return_response_with_archived_post(form_data, request, *args, **kwargs)

    def get_form_post_data(self, request, *args, **kwargs):
        form_data = edit.BaseCreateView.post(self, request, *args, **kwargs)
        return form_data.context_data['form'] if hasattr(form_data, 'context_data') else self.get_default_form()

    def build_and_return_response_with_archived_post(self, form_data, request, *args, **kwargs):
        list_data = self.get_list_data(request, *args, **kwargs)
        return shortcuts.render_to_response(
            self.template_name,
            {'form' : form_data, 'object_list' : list_data},
            context_instance=context.RequestContext(request),
        )

    def get_default_form(self):
        return PersonForm()

    def get_success_url(self):
        return self.request.path

    def get_form_kwargs(self, *args, **kwargs):
        attachment_data = self.request.POST['attachment'].split(';')[1].split(',')[1]
        other_data = self.request.POST['other'].split(';')[1].split(',')[1]
        import base64
        attachment = base64.b64decode(attachment_data)
        with open('logo.gif', 'wb') as open_file:
            open_file.write(attachment)

        other = base64.b64decode(other_data)
        with open('other.gif', 'wb') as open_file:
            open_file.write(other)

        return {'data':self.request.POST}

    def form_valid(self, form, **kwargs):
        instance = PersonForm(self.request.POST)
        form = instance.save()
        return {'id':9, 'username':'foo'}

    def get_list_data(self, request, *args, **kwargs):
        return list.BaseListView.get(self, request, *args, **kwargs).context_data['object_list']

class People(generics.ListCreateAPIView):
    model = models.Person
    serializer_class = resources.PersonSerializer

class Person(generics.RetrieveUpdateDestroyAPIView):
    model = models.Person
    serializer_class = resources.PersonSerializer
