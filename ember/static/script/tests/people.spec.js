require('static/script/vendor/filtersortpage.js');
require('static/script/app/person.js');

describe ("PersonApp.PersonView Tests", function(){

  var sut, router, controller;

  beforeEach(function(){
    sut = PersonApp.PersonView.create();
    router = new Object({send:function(){}});
    controller = PersonApp.PersonController.create({});
    controller.set("target", router);
    sut.set("controller", controller);
  });

  it ("does not invoke send on router when username does not exist", function(){
    var event = {'context': {'username':'', 'set': function(){}}};
    var sendSpy = spyOn(router, 'send');
    sut.addPerson(event);
    expect(sendSpy).not.toHaveBeenCalledWith('addPerson', jasmine.any(String));
  });

  it ("invokes send on router with username when exists", function(){
    var event = {'context': {'username':'foo', 'set': function(){}}};
    var sendSpy = spyOn(router, 'send');
    sut.addPerson(event);
    expect(sendSpy).toHaveBeenCalledWith('addPerson', 'foo');
  });

  it ("does not invoke set context when username does not exist", function(){
    var event = {'context': {'username':'', 'set': function(){}}};
    var setSpy = spyOn(event.context, 'set');
    sut.addPerson(event);
    expect(setSpy).not.toHaveBeenCalledWith('username', jasmine.any(String));
  });

  it ("invokes set context to empty string when username exists", function(){
    var event = {'context': {'username':'foo', 'set': function(){}}};
    var setSpy = spyOn(event.context, 'set');
    sut.addPerson(event);
    expect(setSpy).toHaveBeenCalledWith('username', '');
  });
});
