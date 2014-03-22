var map, lightsSearch = [];

/* Basemap Layers */

var apikey = "7a6596460130463c9d2a7f3ba1404dc9";

var tileLayer =  L.tileLayer('https://{s}.tiles.mapbox.com/v3/hckluke.hj71k342/{z}/{x}/{y}.png', 
      {
        attribution: 'Mapbox/SemáforosSP'
      }
  );


/* Overlay Layers */
var lights = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/lightsfullarrow.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: "Semáforo",
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Local:</th><td>" + feature.properties.local + "</td></tr><table>";

    
        layer.on({
          click: function (e) {
            $("#feature-title").html("Semáforo");
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
            $("#alert-light-btn").click(function()
               {
                  var btn = $(this);
                  btn.button('loading');

               });
          }
        });

      
      lightsSearch.push({
        name: layer.feature.properties.local,
        source: "Lights",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("http://54.207.15.65/semaforos", function (data) {
	var i;
	var geodata = {
		type: "FeatureCollection",
		features: []
	};
	
	for(i=0; i<data.length; i++)
	{
		var feat = {
			type: "Feature",
			id: data[i].id,
			properties: {
					local: data[i].local
				},
			geometry: {
				type: "Point",
				coordinates: [ data[i].longitude, data[i].latitude ]
			}
		};
		geodata.features.push(feat);
	}
	
  lights.addData(geodata);
});


map = L.map("map", {
  zoom: 10,
  center: [-25.554451, -46.632823],
  layers: [tileLayer]
});

map.setView([-23.554451, -46.632823],14);

/* Larger screens get expanded layer control */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": tileLayer,
};

/* Add overlay layers to map after defining layer control to preserver order */



/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  //map.fitBounds(boroughs.getBounds());
  var cluster = new L.markerClusterGroup();
cluster.addLayer(lights);

map.addLayer(cluster);
  $("#loading").hide();


  var lightsBH = new Bloodhound({
    name: "Lights",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: lightsSearch,
    limit: 10
  });

 
  lightsBH.initialize();


  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Lights",
    displayKey: "name",
    source: lightsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/lightsfullarrow.png' width='24' height='28'>&nbsp;Semáforos</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    
    if (datum.source === "Lights") {      
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }

    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }

    
    }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

/* Placeholder hack for IE */
if (navigator.appName == "Microsoft Internet Explorer") {
  $("input").each(function () {
    if ($(this).val() === "" && $(this).attr("placeholder") !== "") {
      $(this).val($(this).attr("placeholder"));
      $(this).focus(function () {
        if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
      });
      $(this).blur(function () {
        if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
      });
    }
  });
}
