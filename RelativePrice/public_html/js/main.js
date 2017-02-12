function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

function recalculate()
{
    document.getElementById('pricePerKm').value = calculatePricePerKilometer();
}

function getMyLocation()
{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position)
{
    $('#latitude_float').val(position.coords.latitude);
    $('#longitude_float').val(position.coords.longitude);    
}

function calculatePricePerKilometer()
{
    var pricePerLiter = $('#priceFuelPerLiter').val();
    var litersPer100Kilometer = $('#fuelEfficiency').val();
 //    €/l l/100km
    var litersPerKilometer = litersPer100Kilometer / 100;
    var pricePerKilometer = litersPerKilometer * pricePerLiter;
    return pricePerKilometer;
}

function populateStoreTableUsingMaps()
{ // http://localhost:8080/store
    
    map = new google.maps.Map(document.getElementById('map'), {
      center: mylocation,
      zoom: 15
    });

    service = new google.maps.places.PlacesService(map);
    var mylocation = new google.maps.LatLng($('#latitude_float').val(), $('#longitude_float').val());

    var request = {
    location: mylocation,
    radius: $("#radius").val(),
    types: ['store'],
    keyword: ['Supermarket']
  };

    service.nearbySearch(request, renderStoreTableMaps);
}    

function populateStoreTable()
{ // http://localhost:8080/store
    
    $.getJSON( "http://localhost:5984/prices/_all_docs?include_docs=true&conflicts=true", function( json ) {
        renderStoreTable(json);
    });
}           

function renderStoreTable(json)
{
        var pricePerKm = calculatePricePerKilometer();    
        var current = 1;
        $.each( json.rows, function( key, val ) {
            var store = val.doc.store;
            storetable = document.getElementById('storetable');
            var row = storetable.insertRow(current);
            var cell = 0;
            var number = row.insertCell(cell++);
            var storename = row.insertCell(cell++);
            var latitude = row.insertCell(cell++);
            var longitude = row.insertCell(cell++);
            var distance = row.insertCell(cell++);
            var cost = row.insertCell(cell++);
            
            var distanceCalculated = getDistanceFromLatLonInKm($('#latitude_float').val(), $('#longitude_float').val(), store.lattitude, store.longitude);

            // Add some text to the new cells:
            number.innerHTML    = current++;
            storename.innerHTML = store.name;
            latitude.innerHTML  = store.lattitude;
            longitude.innerHTML = store.longitude;
            distance.innerHTML  = distanceCalculated + " km";
            cost.innerHTML      = pricePerKm * distanceCalculated * 2;

        });
}


function renderStoreTableMaps(places, status)
{
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        storetable = document.getElementById('storetablebody');
        var pricePerKm = calculatePricePerKilometer();    
        var currentLat = $('#latitude_float').val();
        var currentLong = $('#longitude_float').val();
        
        var current = 1;
        var stores = [];
        for (var i = 0; i < places.length; i++)
        {
            var place = places[i];
            var distanceCalculated = getDistanceFromLatLonInKm(currentLat, currentLong, place.geometry.location.lat(), place.geometry.location.lng());

            stores.push({
              "city" : place.vicinity,
              "storename": place.name,
              "longitude": place.geometry.location.lng(),
              "latitude" : place.geometry.location.lat(),
              "distance" : distanceCalculated + " km",
              "cost" : pricePerKm * distanceCalculated * 2    
            });            
        }
        stores.sort(function(a, b) {
            return a.cost - b.cost;
        });
        var lines  = "";
        for (var i = 0; i < stores.length; i++ )
        {
            var store = stores[i];
            lines = lines + "<tr><td>"+store.storename+"</td><td>" + store.city + "</td><td>" + store.latitude + "</td>" + "<td>"+ store.longitude + "</td><td>" + store.distance + "</td><td>"+ store.cost +"</td></tr>"
        }
        storetable.innerHTML = lines;
    }
}

function populateStorePriceTable()
{
    $.getJSON( "http://localhost:5984/storeprices/_all_docs?include_docs=true&conflicts=true", function( json ) {        
        renderStorePrices(json);
    });

}

function renderStorePrices(json)
{
            $.each( json.rows, function( key, val ) {
            var store = val.doc.store;
            storetable = document.getElementById('storeprice');
            var row = storetable.insertRow(1);
            var shop = row.insertCell(0);
            var productName = row.insertCell(1);
            var price = row.insertCell(2);
            var package = row.insertCell(3);
            var lastUpdate = row.insertCell(4);
            
            $.each( store.prices, function( key, val ) {
                productName.innerHTML = val.brandname;
                shop.innerHTML    = store.name;
                price.innerHTML = val.priceInEuro;
                package.innerHTML = val.package;
                lastUpdate.innerHTML = new Date(val.lastupdateEpoch * 1000).toGMTString();
            });            

        });
}

function loadUserData()
{
     $.getJSON( "http://localhost:5984/userdetails/b9b5b7d4348089fb794ab933f7000354", function( data ) {    
         renderUserData(data);
     });
     
}

function renderUserData(data)
{
    $('#latitude_float').val(data.lattitude);
    $('#longitude_float').val(data.longitude);
    $('#priceFuelPerLiter').val(data.pricePerLiter);
    $('#fuelEfficiency').val(data.litersPerKm);
}

function addStore()
{
    var name = $('#name1').val();
    var latitude = $('#gpslatitude1').val();
    var longitude = $('#gpslongitude1').val();
    var json = '{"store" : {"name":  "'+ name + '", "lattitude":  "'+ latitude + '",  "longitude":  "'+ longitude + '" }}';
    $.ajax({
        type: "POST",
        url: "http://localhost:5984/prices",
        data: json,
        contentType: "application/json",
        dataType: "json",
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
    });
}

function addPrice()
{
    var name = $('#name').val();
    var package = $('#package').val();
    var price = $('#price').val();
    var json = '{"store" : {"name":  "'+ name + '", "package":  "'+ package + '",  "price":  "'+ price + '" }}';
    $.ajax({
        type: "POST",
        url: "http://localhost:5984/storeprices",
        data: json,
        contentType: "application/json",
        dataType: "json",
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
    });
}
