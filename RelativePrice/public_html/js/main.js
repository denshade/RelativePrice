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
{
    var pricePerKm = calculatePricePerKilometer();
    json = 
            { 
                "stores" : 
                [
                    {"store" : 
                        {
                            "name" : "Delhaize Deinze",
                            "lattitude" : "50.9809227", 
                            "longitude" : "3.5344354"        
                        }
                    },
                    {"store" : 
                        {
                            "name" : "Delhaize Zingem",
                            "lattitude" : "50.9029995",
                            "longitude" : "3.6538823"        
                        }
                    },
                    {"store" : 
                        {
                            "name" : "Macro",
                            "lattitude" : "50.978919",
                            "longitude" : "3.6609026"        
                        }
                    },
                    {"store" : 
                        {
                            "name" : "Colruyt Deinze",
                            "lattitude" : "50.9807994",
                            "longitude" : "3.5472237 "        
                        }
                    },
                    {"store" : 
                        {
                            "name" : "Spar",
                            "lattitude" : "50.9110302",
                            "longitude" : "3.6056243"        
                        }
                    },
                    {"store" : 
                        {
                            "name" : "Okay Zingem",
                            "lattitude" : "50.9073175",
                            "longitude" : "3.6389592"        
                        }
                    }
                ]                
            };

        $.each( json.stores, function( key, val ) {
            var store = val.store;
            storetable = document.getElementById('storetable');
            var row = storetable.insertRow(1);
            var number = row.insertCell(0);
            var storename = row.insertCell(1);
            var latitude = row.insertCell(2);
            var longitude = row.insertCell(3);
            var distance = row.insertCell(4);
            var cost = row.insertCell(5);
            
            var distanceCalculated = getDistanceFromLatLonInKm(document.getElementById('latitude_float').value, document.getElementById('longitude_float').value, store.lattitude, store.longitude);

            // Add some text to the new cells:
            number.innerHTML    = 0;
            storename.innerHTML = store.name;
            latitude.innerHTML  = store.lattitude;
            longitude.innerHTML = store.longitude;
            distance.innerHTML  = distanceCalculated + " km";
            cost.innerHTML      = pricePerKm * distanceCalculated * 2;

        });


}