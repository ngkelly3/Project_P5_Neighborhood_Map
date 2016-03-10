function initMap(){map=new google.maps.Map(document.getElementById("map"),{center:initLocation.center,zoom:initLocation.zoom});var a=new google.maps.LatLngBounds;for(i=0;i<initLocations.length;i++)marker=new google.maps.Marker({position:{lat:initLocations[i].lat,lng:initLocations[i].lng},map:map,animation:google.maps.Animation.DROP,title:initLocations[i].name}),marker.addListener("click",function(){null!==this.getAnimation()?this.setAnimation(null):(self=this,this.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){self.setAnimation(null)},750))}),a.extend(marker.getPosition()),initLocations[i].marker=marker;map.fitBounds(a),ko.applyBindings(new ViewModel)}function showMarkers(a){for(i=0;i<a.length;i++)a[i].marker().setVisible(!0)}var initLocations=[{name:"Steveston Starbucks",lat:49.12688,lng:-123.180715},{name:"Waves Coffee",lat:49.124358,lng:-123.182935},{name:"Rocanini Coffee Roasters",lat:49.125256,lng:-123.181389},{name:"Blenz Coffee",lat:49.124258,lng:-123.182101},{name:"Steveston Coffee Co.",lat:49.125439,lng:-123.18494}],initLocation={center:{lat:49.128,lng:-123.186},zoom:15},Venue=function(a){this.name=ko.observable(a.name),this.lat=ko.observable(a.lat),this.lng=ko.observable(a.lng),this.marker=ko.observable(a.marker)},stringStartsWith=function(a,b){return a=a||"",b.length>a.length?!1:a.substring(0,b.length)===b},ViewModel=function(){var a=this;a.itemClick=function(a){google.maps.event.trigger(this.marker(),"click")},this.venueList=ko.observableArray(),this.filter=ko.observable(""),initLocations.forEach(function(b){a.venueList.push(new Venue(b))}),this.filteredItems=ko.computed(function(){var b=a.filter().toLowerCase();return b?ko.utils.arrayFilter(a.venueList(),function(a){return stringStartsWith(a.name().toLowerCase(),b)?a.marker().setVisible(!0):a.marker().setVisible(!1),stringStartsWith(a.name().toLowerCase(),b)}):(showMarkers(a.venueList()),a.venueList())});var b="",c=new google.maps.InfoWindow({content:b});this.venueList().forEach(function(a){var d="https://api.foursquare.com/v2/venues/explore?ll=49.128,-123.186&intent=match&query="+a.name()+"&oauth_token=XAWSNU4RT5PGM1MKUZWX3BD1Y1LQTQLFBX1JCVR55OKZN1QI&v=20160304";$.getJSON(d,function(d){a.hours=d.response.groups[0].items[0].venue.hours.status,a.url=d.response.groups[0].items[0].venue.url,a.hereNow=d.response.groups[0].items[0].venue.hereNow.summary,a.address=d.response.groups[0].items[0].venue.location.formattedAddress,a.contact=d.response.groups[0].items[0].venue.contact,a.marker().addListener("click",function(){b='<div id="content"><h2 id="firstHeading" class="firstHeading"><a href='+a.url+">"+a.name()+"</a></h2><h4>"+a.hours+'</h4><div id="bodyContent"><p>'+a.hereNow+"</p><p>"+a.address[0]+"</p><p>"+a.address[1]+"</p><p>"+a.contact.phone+"</p><p>Data powered by Foursquare Labs</p></div></div>",c.setContent(b),c.open(map,a.marker())})}).fail(function(a){alert("Foursquare data cannot be loaded!")})})};
//# sourceMappingURL=../../path/to/sourcemap.map