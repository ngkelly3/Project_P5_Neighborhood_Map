// Set initial map location
var numLocations = 9;

// var gmarkers = [];

// Needs to be set later by the user as an input
var initLocation = {
    center: {lat: 49.128, lng: -123.186},
    zoom: 12
}

function initMap() {
    //write script to insert API key into HTML code
    map = new google.maps.Map(document.getElementById('map'), {
        center: initLocation.center,
        zoom: initLocation.zoom
    });

}



// Constructor function for new locations (only name is stored for now)
var Venue = function(data) {

    this.name = ko.observable(data.venue.name);
    this.lat = ko.observable(data.venue.location.lat);
    this.lng = ko.observable(data.venue.location.lng);
    this.marker = ko.observable();
    this.info = ko.observable();


}

/*function removeMarkers(){
    for(i=0; i<gmarkers.length; i++){
        gmarkers[i].setMap(null);
    }
}*/

function setMarkers(data) {

    for (i=0; i<data.length; i++) {
        marker = new google.maps.Marker({
            position: {lat: data[i].lat(), lng: data[i].lng()},
            map: map,
            title: data[i].name()
        });
        data[i].marker(marker);
        // gmarkers.push(marker);
    };

};

function removeMarkers(data) {

    for (i=0; i<data.length; i++) {
        data[i].marker().setVisible(false);
    }

}

var stringStartsWith = function (string, startsWith) {
    //console.log(string);
    //console.log(startsWith);
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};

var ViewModel = function () {

    var self = this;
    this.venueList = ko.observableArray();
    this.filter = ko.observable(''); // have to initiate a value


    /*
    // grab data from API
    var fsqElements = [];
    var fsqUrl = 'https://api.foursquare.com/v2/venues/explore?ll=49.128,-123.186&oauth_token=XAWSNU4RT5PGM1MKUZWX3BD1Y1LQTQLFBX1JCVR55OKZN1QI&v=20160304'

    // by definition this request is async, so the rest of the browser will load despite this not being done.  That's why you have to use the .done callback function, that's the only place where the data will be ready.
    $.getJSON(fsqUrl, function(data) {
        // The following code grabs FSQ data into objects, but the data is not yet organized
        for (i = 0; i < numLocations; i++){
            fsqElements.push(data.response.groups[0].items[i]);

        }
    }).done(function() {

        // parses the data into objects to be used by the the view
        fsqElements.forEach(function(venueItem){
            self.venueList.push( new Venue(venueItem) );
        });

        // set map markers (search radius is too large) - although it needs to be an observable item if I want it to update with the view... shit
        setMarkers(self.venueList());

        // for reference
        //self.venueList()[0].marker().setVisible(false);
        //console.log(self.venueList()[0].marker());

    }).fail(function(e) {
        $fsqHeaderElem.text('Foursquare cannot be loaded');
    });
    */

console.log(fsqElements);
    // set up filter functionality, right now, filtereditems is binded to the view, so if this works properly then the list will update accordingly
    // so the code below works!  now I get it.  The function actually parameter takes "venueList" as an argument, and venue represents each object within venueList.  I was just too stubborn to figure it out, I guess.  Maybe I was just too distracted.  Either way, it works now, so I'm happy - and most importantly, I understand WHY it works.
    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            console.log(self.venueList());
            return self.venueList();
        } else {
            return ko.utils.arrayFilter(self.venueList(), function(venue) {
                return stringStartsWith(venue.name().toLowerCase(), filter);
            });
        }
    });

}

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
});


