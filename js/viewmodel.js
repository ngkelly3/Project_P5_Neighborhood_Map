var ViewModel = function () {

    this.venueList = ko.observableArray([]);

    console.log(fsqElements);

    fsqElements.forEach(function(venueItem){
        self.venueList.push( new Venue(venueItem) );


    });

    return false;

}

ko.applyBindings(new ViewModel());