/**
    * @ngdoc service
    * @name umbraco.resources.mediaResource
    * @description Loads in data for media
    **/
function mediaResource($q, $http, umbDataFormatter, umbRequestHelper) {
    
    /** internal method process the saving of data and post processing the result */
    function saveMediaItem(content, action, files) {
        return umbRequestHelper.postSaveContent({
            restApiUrl: umbRequestHelper.getApiUrl(
                "mediaApiBaseUrl",
                "PostSave"),
            content: content,
            action: action,
            files: files,
            dataFormatter: function (c, a) {
                return umbDataFormatter.formatMediaPostData(c, a);
            }
        });
    }

    return {
        
        /**
         * @ngdoc method
         * @name umbraco.resources.mediaResource#sort
         * @methodOf umbraco.resources.mediaResource
         *
         * @description
         * Sorts all children below a given parent node id, based on a collection of node-ids
         *
         * ##usage
         * <pre>
         * var ids = [123,34533,2334,23434];
         * mediaResource.sort({ sortedIds: ids })
         *    .then(function() {
         *        $scope.complete = true;
         *    });
         * </pre> 
         * @param {Object} args arguments object
         * @param {Int} args.parentId the ID of the parent node
         * @param {Array} options.sortedIds array of node IDs as they should be sorted
         * @returns {Promise} resourcePromise object.
         *
         */
        sort: function (args) {
            if (!args) {
                throw "args cannot be null";
            }
            if (!args.parentId) {
                throw "args.parentId cannot be null";
            }
            if (!args.sortedIds) {
                throw "args.sortedIds cannot be null";
            }

            return umbRequestHelper.resourcePromise(
                $http.post(umbRequestHelper.getApiUrl("mediaApiBaseUrl", "PostSort"),
                    {
                        parentId: args.parentId,
                        idSortOrder: args.sortedIds
                    }),
                'Failed to sort content');
        },
        /**
         * @ngdoc method
         * @name umbraco.resources.mediaResource#getById
         * @methodOf umbraco.resources.mediaResource
         *
         * @description
         * Gets a media item with a given id
         *
         * ##usage
         * <pre>
         * mediaResource.getById(1234)
         *    .then(function(media) {
         *        var myMedia = media; 
         *        alert('its here!');
         *    });
         * </pre> 
         * 
         * @param {Int} id id of media item to return        
         * @returns {Promise} resourcePromise object containing the media item.
         *
         */
        getById: function (id) {
            
            return umbRequestHelper.resourcePromise(
               $http.get(
                   umbRequestHelper.getApiUrl(
                       "mediaApiBaseUrl",
                       "GetById",
                       [{ id: id }])),
               'Failed to retreive data for media id ' + id);
        },

        /**
         * @ngdoc method
         * @name umbraco.resources.mediaResource#deleteById
         * @methodOf umbraco.resources.mediaResource
         *
         * @description
         * Deletes a media item with a given id
         *
         * ##usage
         * <pre>
         * mediaResource.deleteById(1234)
         *    .then(function() {
         *        alert('its gone!');
         *    });
         * </pre> 
         * 
         * @param {Int} id id of media item to delete        
         * @returns {Promise} resourcePromise object.
         *
         */
        deleteById: function(id) {
            return umbRequestHelper.resourcePromise(
                $http.delete(
                    umbRequestHelper.getApiUrl(
                        "mediaApiBaseUrl",
                        "DeleteById",
                        [{ id: id }])),
                'Failed to delete item ' + id);
        },

        /**
         * @ngdoc method
         * @name umbraco.resources.mediaResource#getByIds
         * @methodOf umbraco.resources.mediaResource
         *
         * @description
         * Gets an array of media items, given a collection of ids
         *
         * ##usage
         * <pre>
         * mediaResource.getByIds( [1234,2526,28262])
         *    .then(function(mediaArray) {
         *        var myDoc = contentArray; 
         *        alert('they are here!');
         *    });
         * </pre> 
         * 
         * @param {Array} ids ids of media items to return as an array        
         * @returns {Promise} resourcePromise object containing the media items array.
         *
         */
        getByIds: function (ids) {
            
            var idQuery = "";
            _.each(ids, function(item) {
                idQuery += "ids=" + item + "&";
            });

            return umbRequestHelper.resourcePromise(
               $http.get(
                   umbRequestHelper.getApiUrl(
                       "mediaApiBaseUrl",
                       "GetByIds",
                       idQuery)),
               'Failed to retreive data for media ids ' + ids);
        },

        /**
         * @ngdoc method
         * @name umbraco.resources.mediaResource#getScaffold
         * @methodOf umbraco.resources.mediaResource
         *
         * @description
         * Returns a scaffold of an empty media item, given the id of the media item to place it underneath and the media type alias.
         * 
         * - Parent Id must be provided so umbraco knows where to store the media
         * - Media Type alias must be provided so umbraco knows which properties to put on the media scaffold 
         * 
         * The scaffold is used to build editors for media that has not yet been populated with data.
         * 
         * ##usage
         * <pre>
         * mediaResource.getScaffold(1234, 'folder')
         *    .then(function(scaffold) {
         *        var myDoc = scaffold;
         *        myDoc.name = "My new media item"; 
         *
         *        mediaResource.save(myDoc, true)
         *            .then(function(media){
         *                alert("Retrieved, updated and saved again");
         *            });
         *    });
         * </pre> 
         * 
         * @param {Int} parentId id of media item to return
         * @param {String} alias mediatype alias to base the scaffold on        
         * @returns {Promise} resourcePromise object containing the media scaffold.
         *
         */
        getScaffold: function (parentId, alias) {
            
            return umbRequestHelper.resourcePromise(
               $http.get(
                   umbRequestHelper.getApiUrl(
                       "mediaApiBaseUrl",
                       "GetEmpty",
                       [{ contentTypeAlias: alias }, { parentId: parentId }])),
               'Failed to retreive data for empty media item type ' + alias);

        },

        rootMedia: function () {
            
            return umbRequestHelper.resourcePromise(
               $http.get(
                   umbRequestHelper.getApiUrl(
                       "mediaApiBaseUrl",
                       "GetRootMedia")),
               'Failed to retreive data for root media');

        },

        /**
         * @ngdoc method
         * @name umbraco.resources.mediaResource#getChildren
         * @methodOf umbraco.resources.mediaResource
         *
         * @description
         * Gets children of a media item with a given id
         *
         * ##usage
         * <pre>
         * mediaResource.getChildren(1234, {pageSize: 10, pageNumber: 2})
         *    .then(function(contentArray) {
         *        var children = contentArray; 
         *        alert('they are here!');
         *    });
         * </pre> 
         * 
         * @param {Int} parentid id of content item to return children of
         * @param {Object} options optional options object
         * @param {Int} options.pageSize if paging data, number of nodes per page, default = 0
         * @param {Int} options.pageNumber if paging data, current page index, default = 0
         * @param {String} options.filter if provided, query will only return those with names matching the filter
         * @param {String} options.orderDirection can be `Ascending` or `Descending` - Default: `Ascending`
         * @param {String} options.orderBy property to order items by, default: `SortOrder`
         * @returns {Promise} resourcePromise object containing an array of content items.
         *
         */
        getChildren: function (parentId, options) {

            var defaults = {
                pageSize: 0,
                pageNumber: 0,
                filter: '',
                orderDirection: "Ascending",
                orderBy: "SortOrder"
            };
            if (options === undefined) {
                options = {};
            }
            //overwrite the defaults if there are any specified
            angular.extend(defaults, options);
            //now copy back to the options we will use
            options = defaults;
            //change asc/desct
            if (options.orderDirection === "asc") {
                options.orderDirection = "Ascending";
            }
            else if (options.orderDirection === "desc") {
                options.orderDirection = "Descending";
            }

            return umbRequestHelper.resourcePromise(
               $http.get(
                   umbRequestHelper.getApiUrl(
                       "mediaApiBaseUrl",
                       "GetChildren",
                       [
                           { id: parentId },
                           { pageNumber: options.pageNumber },
                           { pageSize: options.pageSize },
                           { orderBy: options.orderBy },
                           { orderDirection: options.orderDirection },
                           { filter: options.filter }
                       ])),
               'Failed to retreive children for media item ' + parentId);
        },
        
        /** saves or updates a media object */
        save: function (media, isNew, files) {
            return saveMediaItem(media, "save" + (isNew ? "New" : ""), files);
        },

        //** shorthand for creating a new folder under a given parent **/
        addFolder: function(name, parentId){
            return umbRequestHelper.resourcePromise(
                $http.post(umbRequestHelper
                    .getApiUrl("mediaApiBaseUrl", "PostAddFolder"),
                    {
                        name: name,
                        parentId: parentId
                    }),
                'Failed to add folder');
        }
    };
}

angular.module('umbraco.resources').factory('mediaResource', mediaResource);
