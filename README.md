# Modeler

JSON object to JavaScript models converter

## Installation

    require.config({
        paths: {
            "inl": "assets/libs/modeler/src",  //url to modeler src dir
        }
    });

## Usage

### Files

    assets/
        libs/
            modeler/
            ...
    app/
        models/
            User.js
            UserData.js
            Comment.js
    

### Models

User.js

    define(['inl/reference', 'inl/collection'], function (Reference, Collection) {
        'use strict';
    
        /**
         * @constructor
         */
        function User() {
            this.id = undefined;
            this.name = '';
            this.surname = '';
            this.data = new Reference('app/models/UserData', this);
            this.created_at = new Date();
            this.comments = new Collection('app/models/Comment', this);
        }
    
        return User;
    });


UserData.js

    define(function (require) {
        'use strict';
    
        /**
         * @constructor
         */
        function UserData() {
            this.id = undefined;
            this.bankAccountNumber = '';
            this.birthDate = null;
        }
    
        return UserData;
    });


Comment.js

    define(function (require) {
    
        /**
         * @constructor
         */
        function Comment() {
            this.id = undefined;
            this.title = '';
            this.content = '';
            this.created_at = new Date();
        }
    
        return Comment;
    
    });

/api/users.json

    [
        {
            "id": 1,
            "data": {
                "id": 1,
                "bankAccountNumber": "372055188230706",
                "birth_date": "2014-08-10T06:55:37+0200"
            },
            "comments": [
                {
                    "id": 172,
                    "title": "aliquet, sem",
                    "content": "sollicitudin adipiscing ligula. Aenean gravida nunc sed pede. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur",
                    "created_at": "2012-04-23T20:48:07+0200"
                }
            ],
            "name": "Priscilla",
            "surname": "Hoffman",
            "created_at": "2014-12-05T09:32:29+0100"
        },
        {
            "id": 2,
            "data": {
                "id": 2,
                "bankAccountNumber": "342001453077423", 
                "birth_date": "2015-02-11T08:35:31+0100"
            },
            "comments": [
                {
                    "id": 101,
                    "title": "amet orci. Ut sagittis lobortis mauris. Suspendisse",
                    "content": "sed libero. Proin sed turpis nec mauris blandit mattis. Cras eget nisi dictum augue malesuada malesuada. Integer id magna et ipsum",
                    "created_at": "2011-07-29T18:23:55+0200"
                },
                {
                    "id": 134,
                    "title": "a, enim. Suspendisse aliquet, sem ut",
                    "content": "Sed nunc est, mollis non, cursus non, egestas a, dui. Cras pellentesque. Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam",
                    "created_at": "2012-10-06T05:28:27+0200"
                }
            ],
            "name": "Rogan",
            "surname": "Wolf",
            "created_at": "2014-10-07T03:51:20+0200"
        }
    ]

index.html

    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <title>Modeler example page</title>
        </head>
        <body>
            <script src="/require.js"></script>
            
            <script type="text/javascript">
                requirejs(["inl/modeler"], function(Modeler) {
                    var mo = new Modeler();
                    $.ajax({
                        url: '/api/users.json',
                        type: 'json',
                        method: 'get',
                        success: function(responseData) {
                            mo.map('app/models/User', responseData, function(users) {
                                // Here you got mapped responseData from JSON objects into User model
                                
                                [User, User]
                                    0: User
                                        __state: "FETCHED"
                                        comments: Array[1]
                                            0: Comment
                                                __state: "FETCHED"
                                                content: "sollicitudin adipiscing ligula. Aenean gravida nunc sed pede. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur"
                                                created_at: "2012-04-23T20:48:07+0200"
                                                id: 172
                                                title: "aliquet, sem"
                                                __proto__: Comment
                                            length: 1
                                            __proto__: Array[0]
                                        created_at: "2014-12-05T09:32:29+0100"
                                        data: UserData
                                            __state: "FETCHED"
                                            birthDate: null
                                            id: 1
                                            pesel: "372055188230706"
                                            __proto__: UserData
                                        id: 1
                                        name: "Priscilla"
                                        surname: "Hoffman"
                                        __proto__: User
                                
                                    1: User
                                        __state: "FETCHED"
                                        comments: Array[2]
                                            0: Comment
                                                __state: "FETCHED"
                                                content: "sed libero. Proin sed turpis nec mauris blandit mattis. Cras eget nisi dictum augue malesuada malesuada. Integer id magna et ipsum"
                                                created_at: "2011-07-29T18:23:55+0200"
                                                id: 101
                                                title: "amet orci. Ut sagittis lobortis mauris. Suspendisse"
                                                __proto__: Comment
                                            1: Comment
                                                __state: "FETCHED"
                                                content: "Sed nunc est, mollis non, cursus non, egestas a, dui. Cras pellentesque. Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam"
                                                created_at: "2012-10-06T05:28:27+0200"
                                                id: 134
                                                title: "a, enim. Suspendisse aliquet, sem ut"
                                                __proto__: Comment
                                            length: 2
                                            __proto__: Array[0]
                                        created_at: "2014-10-07T03:51:20+0200"
                                        data: UserData
                                            __state: "FETCHED"
                                            birthDate: null
                                            id: 2
                                            pesel: "342001453077423"
                                            __proto__: UserData
                                        id: 2
                                        name: "Rogan"
                                        surname: "Wolf"
                                        __proto__: User
                                    length: 2
                                    __proto__: Array[0]
                            });
                        }
                    });
                });
            </script>
        </body>
    </html>
