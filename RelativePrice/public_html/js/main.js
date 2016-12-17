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
  return deg * (Math.PI/180)
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
    document.getElementById('latitude_float').value = position.coords.latitude;
    document.getElementById('longitude_float').value = position.coords.longitude;    
}
function calculatePricePerKilometer()
{
    var pricePerLiter = document.getElementById('priceFuelPerLiter').value;
    var litersPer100Kilometer = document.getElementById('fuelEfficiency').value;
 //    €/l l/100km
    var litersPerKilometer = litersPer100Kilometer / 100;
    var pricePerKilometer = litersPerKilometer * pricePerLiter;
    return pricePerKilometer;
}

function populateStoreTable()
{ // http://localhost:8080/store
    
    $.getJSON( "http://localhost:5984/prices/_all_docs?include_docs=true&conflicts=true", function( data ) {
        workIt(data);
    });
}           
function workIt(json)
{
        var pricePerKm = calculatePricePerKilometer();    
        var current = 1;
        $.each( json.rows, function( key, val ) {
            var store = val.doc.store;
            storetable = document.getElementById('storetable');
            var row = storetable.insertRow(current);
            var number = row.insertCell(0);
            var storename = row.insertCell(1);
            var latitude = row.insertCell(2);
            var longitude = row.insertCell(3);
            var distance = row.insertCell(4);
            var cost = row.insertCell(5);
            
            var distanceCalculated = getDistanceFromLatLonInKm(document.getElementById('latitude_float').value, document.getElementById('longitude_float').value, store.lattitude, store.longitude);

            // Add some text to the new cells:
            number.innerHTML    = current++;
            storename.innerHTML = store.name;
            latitude.innerHTML  = store.lattitude;
            longitude.innerHTML = store.longitude;
            distance.innerHTML  = distanceCalculated + " km";
            cost.innerHTML      = pricePerKm * distanceCalculated * 2;

        });


}

function populateStorePriceTable()
{
    $.getJSON( "http://localhost:5984/storeprices/_all_docs?include_docs=true&conflicts=true", function( json ) {
        
        $.each( json.rows, function( key, val ) {
            var store = val.doc.store;
            storetable = document.getElementById('storeprice');
            var row = storetable.insertRow(1);
            var shop = row.insertCell(0);
            var productName = row.insertCell(1);
            var price = row.insertCell(2);
            var lastUpdate = row.insertCell(3);
            
            $.each( store.prices, function( key, val ) {
                productName.innerHTML = val.brandname;
                shop.innerHTML    = store.name;
                price.innerHTML = val.priceInEuro;
                lastUpdate.innerHTML = new Date(val.lastupdateEpoch*1000);
            });
        });
    });

}