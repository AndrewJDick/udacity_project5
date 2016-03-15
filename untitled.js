    // filter: function () {
    //     var self = this;

    //     var locations = model.locations;

    //     // Stores our model objects in an observable array
    //     this.items = ko.observableArray(locations);

    //     // Track the user input of the search box (empty by default)
    //     this.currentSearch = ko.observable('');

    //     function matchesSearch(poi) {
    //         // console.log(poi);
    //         // Return anything that exists in the name or about properties of the list view that matches the search.
    //         var currentSearch = self.currentSearch();
    //         return poi.name.indexOf(currentSearch) >= 0 || poi.about.indexOf(currentSearch) >= 0;
    //     }

    //     // Since currentSearch is initially blank, the function will return all objects in the model, generating an <li><a><p> for each of them.
    //     this.filteredItems = ko.computed(function () {
    //         return self.items().filter(matchesSearch);
    //     });

        // a combined observable that will trigger its subscribers whenever either the search OR the items are updated
        this.searchAndItems = ko.computed(function () {
            return {
                currentSearch: self.currentSearch(),
                items: self.items().map(function (poi) {
                    return Object.assign({}, poi, {
                        visible: matchesSearch(poi)
                    });
                })
            };
        });
    // },



            // viewModel.searchAndItems.subscribe(function(searchAndItems) {
            //     console.log(searchAndItems);
            //     // in here, searchAndItems.currentSearch === currentSearch
            //      // and searchAndItems.items === items with `visible` set properly
            // })