var initialCats = [
    {
        clickCount: 0,
        name: 'Tabby',
        imgSrc: 'img/cat_picture1.jpg',
        imgAttribution: 'www.kellyng.com',
        nickname: ['Tracy']
    },
    {
        clickCount: 0,
        name: 'Daisy',
        imgSrc: 'img/cat_picture2.jpeg',
        imgAttribution: 'www.kellyng.com',
        nickname: ['Dear']
    }
]

var Cat = function(data) {

// separating Model from the View
    this.clickCount = ko.observable(data.clickCount);
    this.name = ko.observable(data.name);
    this.imgSrc = ko.observable(data.imgSrc);
    this.imgAttribution = ko.observable(data.imgAttribution);
    this.nickname = ko.observableArray(data.nickname);

    this.level = ko.computed(function() {
        console.log(this.clickCount());
        if (this.clickCount() > 10) {
            return 'infant';
        };
    }, this);

};


var ViewModel = function () {

    var self = this;

    this.catList = ko.observableArray([]);

    initialCats.forEach(function(catItem){
        self.catList.push( new Cat(catItem) );

    });

    // change below such that currentCat changes with each click of a list name
    this.currentCat = ko.observable( this.catList()[0] );

    this.incrementCounter = function() {
        self.currentCat().clickCount(self.currentCat().clickCount() + 1);

        var count = 0;
        count++;
    };

    this.setCat = function(clickedCat) {
        self.currentCat(clickedCat);

    };

}

ko.applyBindings(new ViewModel());