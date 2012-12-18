(function() {
    var get = Ember.get, set = Ember.set;

    DS.DjangoRESTAdapter = DS.RESTAdapter.extend({
        bulkCommit: false,

        createRecord: function(store, type, record) {
            var root = this.rootForType(type), json = {};

            var data = new FormData();
            data.append('username', record.get('username'));
            data.append('attachment', record.get('attachment'));
            data.append('other', record.get('other'));

            this.django_file_ajax('http://localhost:8000/people/new/', "POST", {
                data: data,
                context: this,
                success: function(pre_json) {
                    json[root] = pre_json;
                    this.didCreateRecord(store, type, record, json);
                }
            });
        },

        updateRecord: function(store, type, record) {
            var id = get(record, 'id'), root = this.rootForType(type), json = {};
            var data = 'username=%@'.fmt(record.get('username'))

            this.django_ajax(this.buildURL(root, id), "PUT", {
                data: data,
                context: this,
                success: function(pre_json) {
                    json[root] = pre_json;
                    this.didUpdateRecord(store, type, record, json);
                }
            });
        },

        find: function(store, type, id) {
            var root = this.rootForType(type), json = {};

            this.django_ajax(this.buildURL(root, id), "GET", {
                success: function(pre_json) {
                    json[root] = pre_json;
                    this.sideload(store, type, json, root);
                    store.load(type, json[root]);
                }
            });
        },

        findAll: function(store, type) {
            var root = this.rootForType(type), plural = this.pluralize(root), json = {};

            this.django_ajax(this.buildURL(root), "GET", {
                success: function(pre_json) {
                    json[plural] = pre_json;
                    this.sideload(store, type, json, plural);
                    store.loadMany(type, json[plural]);
                }
            });
        },

        django_file_ajax: function(url, type, hash) {
            hash.url = url;
            hash.type = type;
            hash.contentType = false;
            hash.processData = false;
            hash.context = this;

            jQuery.ajax(hash);
        },

        django_ajax: function(url, type, hash) {
            hash.url = url;
            hash.type = type;
            hash.dataType = 'json';
            hash.context = this;

            jQuery.ajax(hash);
        }

    });

})();
