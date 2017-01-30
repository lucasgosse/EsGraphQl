var esGraphQL = require('elasticsearch-graphql')
var graphql = require('graphql')
var hitsSchema = require('./schema')

var graphqlHTTP = require('express-graphql')
var express = require('express')
var cors = require('cors')

var app = express()
var mapping = {
    "properties" : {
        "platform": {
            "type"  : "string",
            "index" : "not_analyzed"
        },
        "date_insert": {
            "type"   : "date",
            "format" : "date_optional_time"
        },
        "title": {
            "type" : "string"
        },
        "url": {
            "type": "string"
        },
        "body": {
            "type": "string"
        },
        "date": {
            "type"   : "date",
            "format" : "date_optional_time"
        },
        "authors": {
            "type"  : "string",
            "index" : "not_analyzed"
        },
        "categories": {
            "type"  : "string",
            "index" : "not_analyzed"
        },
        "tags": {
            "type"  : "string",
            "index" :"not_analyzed"
        },
        "stats": {
            "properties": {
                "views_count": {
                    "type": "integer"
                }
            },
            "comments_count": {
                "type": "integer"
            }
        }
    }
}

var dataMarketPlaceSchema = esGraphQL({
    graphql: graphql,
    name: 'DMP',
    mapping: mapping, // enter your elasticsearch mapping here
    elastic: {
        host: 'https://admin:mvol2cx2bu10xnem1j@c5bb566b38eb5a0bb1584d3bf7640cdf.eu-west-1.aws.found.io:9243',
        index: 'dmp_articles',
        type: 'article',
        query: function(query, context) {
            debugger
            return query
        },
    },
    hitsSchema: hitsSchema
})

app.use(cors())

var graphqlMiddleware = graphqlHTTP(request => ({
    graphiql: true,
    schema: new graphql.GraphQLSchema({
        query: new graphql.GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                "dataMarketPlace": dataMarketPlaceSchema
            }
        })
    }),
    context: request
}))

app.use('/graphql', graphqlMiddleware);

app.listen(8100)
