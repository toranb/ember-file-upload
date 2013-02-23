PersonApp = Ember.Application.create();

PersonApp.ApplicationController = Ember.Controller.extend();

PersonApp.ApplicationView = Ember.View.extend({
  templateName: 'application'
});

PersonApp.Person = DS.Model.extend({
  id: DS.attr('number'),
  username: DS.attr('string'),
  attachment: DS.attr('string'),
  other: DS.attr('string')
});

DS.DjangoRESTAdapter.configure("plurals", {"person" : "people"});
PersonApp.Store = DS.Store.extend({
  revision: 11,
  adapter: DS.DjangoRESTAdapter.create()
});

PersonApp.Router.map(function() {
    this.resource("person", { path: "/" });
});

PersonApp.PersonController = Ember.ObjectController.extend({
  content: null,
  logo: null,
  other: null
});

PersonApp.PersonView = Ember.View.extend({
  templateName: 'person',
  submitFileUpload: function() {
    var person = PersonApp.Person.createRecord({ username: 'heyo', attachment: this.get('controller').get('logo'), other: this.get('controller').get('other') });
    this.get('controller.store').commit();
  }
});

PersonApp.UploadFileView = Ember.TextField.extend({
    type: 'file',
    attributeBindings: ['name'],
    change: function(evt) {
      var self = this;
      var input = evt.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        var that = this;
        reader.onload = function(e) {
          var fileToUpload = e.srcElement.result;
          self.get('controller').set(self.get('name'), fileToUpload);
        }
        reader.readAsDataURL(input.files[0]);
      }
    }
});
