// MODEL DATA
// Set initial map data
var initLocations = [{
    name: 'Steveston Starbucks',
    lat: 49.126880,
    lng: -123.180715,
}, {
    name: 'Waves Coffee',
    lat: 49.124358,
    lng: -123.182935
}, {
    name: 'Rocanini Coffee Roasters',
    lat: 49.125256,
    lng: -123.181389
}, {
    name: 'Adorabelle',
    lat: 49.126059,
    lng: -123.186035
}, {
    name: 'Steveston Coffee Co.',
    lat: 49.125439,
    lng: -123.184940
}];

// Set initial map location
var initLocation = {
    center: {
        lat: 49.128,
        lng: -123.186
    },
    zoom: 15
};

// initialize map
function initMap() {
    //write script to insert API key into HTML code
    map = new google.maps.Map(document.getElementById('map'), {
        center: initLocation.center,
        zoom: initLocation.zoom
    });

    // bounds object to fit screen to the bounds of the window
    var bounds = new google.maps.LatLngBounds();

    // initialize markers with animations
    for (i = 0; i < initLocations.length; i++) {

        marker = new google.maps.Marker({
            position: {
                lat: initLocations[i].lat,
                lng: initLocations[i].lng
            },
            map: map,
            animation: google.maps.Animation.DROP,
            title: initLocations[i].name
        });

        // set marker animations
        marker.addListener('click', function() {
            if (this.getAnimation() !== null) {
                this.setAnimation(null);
            } else {
                self = this;
                this.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    self.setAnimation(null);
                }, 750);
            }
        });

        // fit window to marker bounds
        bounds.extend(marker.getPosition());
        initLocations[i].marker = marker;
    }
    map.fitBounds(bounds);
    // activate knockout.js
    ko.applyBindings(new ViewModel());

}

// Constructor function for new locations (only name is stored for now)
var Venue = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.marker = ko.observable(data.marker);
};

function showMarkers(data) {
    for (i = 0; i < data.length; i++) {
        data[i].marker().setVisible(true);
    }
}

var stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};

// VIEWMODEL DATA

var ViewModel = function() {

    var self = this;

    // link listview with marker and mouseclick
    self.itemClick = function(marker) {
        google.maps.event.trigger(this.marker(), 'click');
    };

    this.venueList = ko.observableArray();
    this.filter = ko.observable(''); // have to initiate a value

    // create objects out of initial location data
    initLocations.forEach(function(venueItem) {
        self.venueList.push(new Venue(venueItem));
    });

    // set up filter functionality
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

    // define infowindow properties
    var contentString = '';
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    // grab data from foursquare API per hardcoded location
    this.venueList().forEach(function(venue) {

        var fsqUrl = 'https://api.foursquare.com/v2/venues/explore?ll=49.128,-123.186&intent=match&query=' + venue.name() + '&oauth_token=XAWSNU4RT5PGM1MKUZWX3BD1Y1LQTQLFBX1JCVR55OKZN1QI&v=20160304';

        $.getJSON(fsqUrl, function(data) {
            // Pass data to objects:
            venue.hours = data.response.groups[0].items[0].venue.hours.status;
            venue.url = data.response.groups[0].items[0].venue.url;
            venue.hereNow = data.response.groups[0].items[0].venue.hereNow.summary;
            venue.address = data.response.groups[0].items[0].venue.location.formattedAddress;
            venue.contact = data.response.groups[0].items[0].venue.contact;

            // Assign infowindow content
            venue.marker().addListener('click', function() {
                contentString = '<div id="content">' + '<h2 id="firstHeading" class="firstHeading">' + '<a href=' + venue.url + '>' + venue.name() + '</a>' + '</h2>' + '<h4>' + venue.hours + '</h4>' + '<div id="bodyContent">' + '<p>' + venue.hereNow + '</p>' + '<p>' + venue.address[0] + '</p>' + '<p>' + venue.address[1] + '</p>' + '<p>' + venue.contact.phone + '</p>' + '<p>' + 'Data powered by Foursquare Labs' + '</p>' + '</div>' + '</div>';
                infowindow.setContent(contentString);
                infowindow.open(map, venue.marker());
            });

            // error handling
        }).fail(function(e) {
            alert('Foursquare data cannot be loaded!');
        });
    });
};