var numLocations = 9;

// Set initial map data
var initLocations = [
    {
        name: 'Steveston Starbucks',
        lat: 49.126880,
        lng: -123.180715,
    },
    {
        name: 'Waves Coffee',
        lat: 49.124358,
        lng: -123.182935
    },
    {
        name: 'Rocanini Coffee Roasters',
        lat: 49.125256,
        lng: -123.181389
    },
    {
        name: 'Blenz Coffee',
        lat: 49.124258,
        lng: -123.182101
    },
    {
        name: 'Steveston Coffee Co.',
        lat: 49.125439,
        lng: -123.184940
    }
]

// Needs to be set later by the user as an input
var initLocation = {
    center: {lat: 49.128, lng: -123.186},
    zoom: 15
}



function initMap() {
    //write script to insert API key into HTML code
    map = new google.maps.Map(document.getElementById('map'), {
        center: initLocation.center,
        zoom: initLocation.zoom
    });



    // initialize markers with animations
    for (i=0; i<initLocations.length; i++) {

        marker = new google.maps.Marker({
            position: {lat: initLocations[i].lat, lng: initLocations[i].lng},
            map: map,
            animation: google.maps.Animation.DROP,
            title: initLocations[i].name
        });
        marker.addListener('click', function() {
          if (this.getAnimation() !== null) {
            this.setAnimation(null);
          } else {
            self = this;
            this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ self.setAnimation(null); }, 750);
          }
        });

        initLocations[i].marker = marker;
    };
    ko.applyBindings(new ViewModel());

}

// Constructor function for new locations (only name is stored for now)
var Venue = function(data) {

    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.marker = ko.observable(data.marker);
    this.info = ko.observable();

}

/*function removeMarkers(){
    for(i=0; i<gmarkers.length; i++){
        gmarkers[i].setMap(null);
    }
}*/

/*function setMarkers(data) {

    for (i=0; i<data.length; i++) {
        marker = new google.maps.Marker({
            position: {lat: data[i].lat, lng: data[i].lng},
            map: map,
            title: data[i].name
        });
        initLocations[i].marker = marker;
        console.log(initLocations[i].marker);
        // gmarkers.push(marker);
    };

};*/

function showMarkers(data) {
    for (i=0; i<data.length; i++) {
        data[i].marker().setVisible(true);
    }

}


function removeMarkers(data) {
    for (i=0; i<data.length; i++) {
        data[i].marker().setVisible(false);
    }

}

var stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};

var ViewModel = function () {

    var self = this;

    self.itemClick = function(marker) {
        google.maps.event.trigger(this.marker(), 'click');
    };


    this.venueList = ko.observableArray();
    this.filter = ko.observable(''); // have to initiate a value

    initLocations.forEach(function(venueItem){
        self.venueList.push( new Venue(venueItem) );
    });



    // set up filter functionality, right now, filtereditems is binded to the view, so if this works properly then the list will update accordingly
    // so the code below works!  now I get it.  The function actually parameter takes "venueList" as an argument, and venue represents each object within venueList.  I was just too stubborn to figure it out, I guess.  Maybe I was just too distracted.  Either way, it works now, so I'm happy - and most importantly, I understand WHY it works.
    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            showMarkers(self.venueList());
            return self.venueList();
        } else {
            return ko.utils.arrayFilter(self.venueList(), function(venue) {
                // updates markers on the map
                if (!stringStartsWith(venue.name().toLowerCase(), filter)) {
                    venue.marker().setVisible(false);
                } else {
                    venue.marker().setVisible(true);
                }
                // returns string to update filter list
                return stringStartsWith(venue.name().toLowerCase(), filter);
            });
        }
    });

    // FOURSQUARE DATA FROM OLD MODEL
    // grab data from API

    var fsqElements = [];
    var infowindow = new google.maps.InfoWindow({
        content: ''
    });

    this.venueList().forEach(function(venue) {

        var fsqUrl = 'https://api.foursquare.com/v2/venues/explore?ll=49.128,-123.186&intent=match&query=' + venue.name() + '&oauth_token=XAWSNU4RT5PGM1MKUZWX3BD1Y1LQTQLFBX1JCVR55OKZN1QI&v=20160304'

        // by definition this request is async, so the rest of the browser will load despite this not being done.  That's why you have to use the .done callback function, that's the only place where the data will be ready.
        $.getJSON(fsqUrl, function(data) {
            // The following code grabs FSQ data into objects, but the data is not yet organized.  Grab the first search element for each location.
            fsqElements.push(data.response.groups[0].items[0]);

            // Now, I need to story the data in the appropriate key/value of the appropriate infowindow:


            // okay, this works.  So we declare infowindow outside the loop, that way only one infowindow object is created on the map itself at any given time.

            // afterwards, we assign infowindow to each venue with its own specific content.
            venue.marker().addListener('click', function() {
                infowindow.setContent(data.response.groups[0].items[0].venue.name);
                infowindow.open(map, venue.marker());

            });



        }).done(function() {

            console.log(fsqElements);

            /*// parses the data into objects to be used by the the view
            fsqElements.forEach(function(venueItem){
                self.venueList.push( new Venue(venueItem) );
            });

            // set map markers (search radius is too large) - although it needs to be an observable item if I want it to update with the view... shit
            setMarkers(self.venueList());

            // for reference
            //self.venueList()[0].marker().setVisible(false);
            //console.log(self.venueList()[0].marker());*/

        }).fail(function(e) {
            $fsqHeaderElem.text('Foursquare cannot be loaded');
        });

    })



}


