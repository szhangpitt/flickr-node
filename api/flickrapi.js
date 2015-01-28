var request = require('request');
var Q = require('q');

module.exports =  (function () {
    function FlickrAPI() {}

    FlickrAPI.ENDPOINT = 'https://api.flickr.com/services/rest/';
    FlickrAPI.APIKey = '7c8048f68c6cffcf51b58b17380a90f5';
    FlickrAPI.Secret = 'fb5c317f514c35b4';

    FlickrAPI.prototype.tags = {
        getRelated: function (tag) {
            var deferred = Q.defer();
            var query = {
                method: 'flickr.tags.getRelated',
                api_key: FlickrAPI.APIKey,
                tag: tag,
                format: 'json',
                nojsoncallback: 1
            };

            console.log('query', query);

            request({
                uri: FlickrAPI.ENDPOINT,
                qs: query
            }, function (error, response, body) {
                console.log('got body: ', body);

                if (body) {
                    deferred.resolve(JSON.parse(body));
                } else {
                    deferred.reject('error!');
                }
            });

            return deferred.promise;
        }
    };

    return FlickrAPI;

}());