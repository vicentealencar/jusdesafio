var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: 'https://54jesnlt:zn1lgjbidi6kggld@ivy-8442486.us-east-1.bonsai.io',
    auth: '54jesnlt:zn1lgjbidi6kggld',
    log:  'info'
});

var indexName = "entities";


// create an entity
module.exports.createEntity = function createEntity( entity, callback ) {
    elasticClient.create({
        index: indexName,
        type:  "entity",
        body:  {
            title:      entity.title,
            entitytype: entity.entitytype
        }
    }).then(function ( resp ) {
        callback(resp);
    }, function ( err ) {
        callback(err.message);
        console.log(err.message);
    });

};


module.exports.execute = function ( title, type, callback ) {

    if ( (title) && (type) ) {

        elasticClient.search({
            index: indexName,
            type:  'entity',
            body:  {
                query: {
                    bool: {
                        must: [
                            {
                                "wildcard": {

                                    "title": {

                                        "value": "*" + title + "*"

                                    }
                                }

                            },

                            {
                                "wildcard": {

                                    "entitytype": {

                                        "value": "*" + type + "*"

                                    }
                                }

                            }
                        ]

                    }

                }

            }
        }).then(function ( resp ) {
            callback(resp.hits);
        }, function ( err ) {
            callback(err.message);
            console.log(err.message);
        });

    }
    else if ( title ) {
        if ( hasWhiteSpace(title) ) {

            elasticClient.search({
                index: indexName,
                type:  'entity',
                body:  {
                    query: {
                        "match_phrase_prefix": {
                            "title": {

                                "query":    title,
                                "max_expansions": 10

                            }
                        }

                    }

                }
            }).then(function ( resp ) {

                callback(resp.hits);
            }, function ( err ) {
                callback(err.message);
                console.log(err.message);
            });

        }
        else {

            elasticClient.search({
                index: indexName,
                type:  'entity',
                body:  {
                    query: {
                        bool: {
                            must: [
                                {
                                    "wildcard": {
                                        "title": {
                                            "value": "*" + title + "*"
                                        }
                                    }
                                }
                            ]
                        }
                    }

                }
            }).then(function ( resp ) {
                callback(resp.hits);
            }, function ( err ) {
                callback(err.message);
                console.log(err.message);
            });

        }
    }
    else if ( type ) {
        if ( hasWhiteSpace(type) ) {

            elasticClient.search({
                index: indexName,
                type:  'entity',
                body:  {
                    query: {
                        "match": {
                            "entitytype": {

                                "query":    type,
                                "operator": "and"

                            }
                        }

                    }

                }
            }).then(function ( resp ) {
                callback(resp.hits);
            }, function ( err ) {
                callback(err.message);
                console.log(err.message);
            });

        } else {
            elasticClient.search({
                index: indexName,
                type:  'entity',
                body:  {
                    query: {
                        bool: {
                            must: [
                                {
                                    "wildcard": {

                                        "entitytype": {

                                            "value": "*" + type + "*"

                                        }
                                    }
                                }
                            ]
                        }

                    }

                }
            }).then(function ( resp ) {
                callback(resp.hits);
            }, function ( err ) {
                callback(err.message);
                console.log(err.message);
            });
        }
    }
    else {
        // get all
        elasticClient.search({
            index: indexName,
            type:  'entity',
            body:  {
                query: {
                    match_all: {}
                }

            }
        }).then(function ( resp ) {
            callback(resp.hits);
        }, function ( err ) {
            callback(err.message);
            console.log(err.message);
        });
    }

    function hasWhiteSpace( s ) {
        return s.indexOf(' ') >= 0;
    }

};