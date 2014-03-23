var map, lightsSearch = [];

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

$('#myTab a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

var tableLangSettings = {
          sLengthMenu: "Mostrar _MENU_ items por página",
          sZeroRecords: "Nada encontrado",
          sInfo: "Mostrando de _START_ a _END_ de _TOTAL_ items",
          sInfoEmpty: "Mostrando de 0 a 0 de 0 items",
          sInfoFiltered: "(filtrado de _MAX_ items)",
          sSearch: "Pesquisar",
          oPaginate: {
            sFirst: "Primeiro",
            sLast: "Último",
            sNext: "Próximo",
            sPrevious: "Anterior"
          }
        };

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
    var img = "assets/img/lightsfullarrow.png";
    if(feature.properties.hasFalha)
    { 
      img = "assets/img/lightsfullarrowred.png"
    }else if(feature.properties.hasOcorrencia)
    {
    img = "assets/img/lightsfullarroworange.png"
    }


    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: img,
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
      var content = "<h3>" + toTitleCase(feature.properties.local) + "</h3>";

    
        layer.on({
          click: function (e) {
            $("#alert-light-btn").button('reset');
            $("#alert-light-msg-content").html("");
            $("#light-data").html("Carregando informações...");
            $("#alert-light-msg").removeClass("alert-success alert-danger");
            $("#feature-title").html("Semáforo");
            $("#feature-info").html(content);
            $("#featureModal").modal("show");

            if(feature.properties.hasFalha)
            {
              $("#alert-light-hasfalha").html("Este semáforo apresenta falhas!")
              $("#alert-light-hasfalha").addClass("alert-danger alert");
            }else
            {
              $("#alert-light-hasfalha").html("")
              $("#alert-light-hasfalha").removeClass("alert-danger alert");
            }

            if(feature.properties.hasOcorrencia)
            {
              $("#alert-light-hasocorrencia").html("Foram comunicados problemas com este semáforo!")
              $("#alert-light-hasocorrencia").addClass("alert-warning alert");
            }else
            {
              $("#alert-light-hasocorrencia").html("")
              $("#alert-light-hasocorrencia").removeClass("alert-warning alert");
            }

            var param = {id: feature.id };

            var tableOptions = {
                  oLanguage:tableLangSettings,     
                      aoColumns: [        
                        {mData: "data_abertura", sTitle: "Abertura", sWidth:"20%"},
                        {mData: "data_encerramento", sTitle: "Encerramento",sWidth:"20%" },
                        {mData: "nome", sTitle: "Falha",sWidth:"60%" }
                        ],    
                  bJQueryUI: true,
                  bDestroy: true,
                  bProcessing: true,
                  bLengthChange:false
              }

            $.post("http://54.207.15.65/semaforos", param,function(data)
            {
                var j;
                for(j = 0; j<data.falhas.length; j++)
                {
                    data.falhas[j].nome = toTitleCase(data.falhas[j].nome);
                    data.falhas[j].data_abertura = moment(data.falhas[j].data_abertura).format('D/M/YYYY h:mm');
                    if(data.falhas[j].data_encerramento)
                    {
                      data.falhas[j].data_encerramento = moment(data.falhas[j].data_encerramento).format('D/M/YYYY h:mm');
                    }else
                    {
                      data.falhas[j].data_encerramento = "Em aberto";
                    }
                }
                var tablehtml = "<div class=\"panel panel-default\"><div class=\"panel-heading\">Histórico de Falhas</div><div class=\"panel-body\"><div class=\"table-responsive\"><table id=\"light-ocorrencia-table\" class=\"table table-stripped table-bordered table-condensed\"></table></div></div></div>"
                tableOptions.aaData = data.falhas;
                $("#light-data").html(tablehtml);
                var dataTable = $("#light-ocorrencia-table").dataTable(tableOptions);

            });

            $("#alert-light-btn").click(function()
               {
                  var btn = $(this);
                  btn.button('loading');
                  
                  $.post("http://54.207.15.65/semaforos/getOcorrencia",param).always(function() 
                  {
                      btn.button('reset');
                  }).done(function()
                  {
                    $("#alert-light-msg").addClass("alert-success");
                    $("#alert-light-msg-content").html("Problema comunicado com sucesso!");
                    $("#alert-light-hasocorrencia").html("Foram comunicados problemas com este semáforo!")
                    $("#alert-light-hasocorrencia").addClass("alert-warning alert");
                    feature.properties.hasOcorrencia = true;
                    if(feature.properties.hasFalha)
                    { 
                      img = "assets/img/lightsfullarrowred.png"
                    }else if(feature.properties.hasOcorrencia)
                    {
                      img = "assets/img/lightsfullarroworange.png"
                    }
                    e.target.setIcon(L.icon({
                      iconUrl: img,
                      iconSize: [24, 28],
                      iconAnchor: [12, 28],
                      popupAnchor: [0, -25]
                    }));

                  }).fail(function()
                  {
               
                    $("#alert-light-msg").addClass("alert-danger");
                    $("#alert-light-msg-content").html("Falha na comunicação do problema!");
                  });

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
					local: data[i].local,
          hasFalha: (data[i].falha > 0),
          hasOcorrencia: (data[i].ocorrencia>0)
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

var sidebar1 = L.control.sidebar("sidebar1", {
  closeButton: true,
  position: "left"
}).addTo(map);

var sidebar2 = L.control.sidebar("sidebar2", {
  closeButton: true,
  position: "left"
}).addTo(map);

var sidebar1thing = function()
{
  sidebar2.hide();
  sidebar1.toggle();
}

var sidebar2thing = function()
{
  sidebar1.hide();
  sidebar2.toggle();
}


 $.get("http://54.207.15.65/semaforos/ocorrencias",function(data)
            {
               var j;

                for(j=0; j<data.length; j++)
                {
                  data[j].local = toTitleCase(data[j].local);
                }
                 var tableOptions = {
                  oLanguage:tableLangSettings,     
                      aoColumns: [        
                        {mData: "local", sTitle: "Semáforo", sWidth:"80%" },
                        {mData: "nroOcorrencias", sTitle: "Ocorrências Reportadas", sWidth:"20%"}
                        ],    
                  bJQueryUI: true,
                  bDestroy: true,
                  bProcessing: true,
                  bLengthChange:false,
                  aaData: data,
                  aaSorting: [[1,"desc"]]
                  }

                  var dataTable = $("#tab-ocorrencias-table").dataTable(tableOptions);


            });

 $.get("http://54.207.15.65/semaforos/falhas/abertas",function(data)
            {

                var j;

                for(j=0; j<data.length; j++)
                {
                  data[j].local = toTitleCase(data[j].local);
                  data[j].nome = toTitleCase(data[j].nome);
                }

                 var tableOptions = {
                  oLanguage:tableLangSettings,     
                      aoColumns: [        
                        {mData: "local", sTitle: "Semáforo", sWidth:"80%" },
                        {mData: "nome", sTitle: "Tipo de Falha", sWidth:"20%"}
                        ],    
                  bJQueryUI: true,
                  bDestroy: true,
                  bProcessing: true,
                  bLengthChange:false,
                  aaData: data
                  }

                  var dataTable = $("#tab-falhas-table").dataTable(tableOptions);


            });


  $.get("http://54.207.15.65/semaforos/falhas",function(data)
            {
               var j;

                for(j=0; j<data.length; j++)
                {
                 data[j].local = toTitleCase(data[j].local);
                }
                 var tableOptions = {
                  oLanguage:tableLangSettings,     
                      aoColumns: [        
                        {mData: "local", sTitle: "Semáforo", sWidth:"80%" },
                        {mData: "nroFalhas", sTitle: "Falhas", sWidth:"20%"}
                        ],    
                  bJQueryUI: true,
                  bDestroy: true,
                  bProcessing: true,
                  bLengthChange:false,
                  aaData: data,
                  aaSorting: [[1,"desc"]]
                  }

                  var dataTable = $("#tab-estatisticas-table").dataTable(tableOptions);


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
