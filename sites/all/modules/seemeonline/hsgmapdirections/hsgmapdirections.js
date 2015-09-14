var hsgmapdirTo;
var hsgmapdirFrom;
var hsgmapdirMapID;

/*
 * Attempt to load directions.
 */
function loadDirections(from, to, mapID){
	hsgmapdirTo = to;
	hsgmapdirFrom = from;
	hsgmapdirMapID = mapID;
		
	testRoute();
}

/*
 * Try to calculate a route. if it succeeds actually load the route
 */
function testRoute(){

    // check if from is filled in
    if(hsgmapdirFrom)
    {
        loadRoute();
    }
    else
    {
        alert('Het ingegeven adres kon niet verwerkt worden. Weet u zeker dat u het goed heeft ingegevoerd?');
    }
}

/*
 * Load the route.
 */
function loadRoute(){
		// Init objects
//	var map = new GMap2();
    var map = new google.maps.Map(document.getElementById(hsgmapdirMapID), {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
//	var panel = document.getElementById("legenda");
//	var dir = new GDirections(map, panel);
/*
	var wp = new Array(2);
	wp[0] = new GLatLng(32.742149,119.337218);
	wp[1] = new GLatLng(32.735347,119.328485);
	*/

	// clear elements
//	dir.clear();
//	panel.innerHTML = "";
//   	GEvent.addListener(dir, 'error',errocc);
//
//   	dir.load('from: ' + hsgmapdirFrom + ' to: ' + hsgmapdirTo);
//	map.addControl(new GSmallMapControl()) ;
//	map.addControl(new GMapTypeControl()) ;

    directionsDisplay.setMap(map);
    var legenda = document.getElementById("legenda");
    // make sure the route is cleared.
    legenda.innerHTML = "";
    directionsDisplay.setPanel(legenda);

    var request = {
        origin: hsgmapdirFrom,
        destination: hsgmapdirTo,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
        if (status != google.maps.DirectionsStatus.OK) {
            alert('Het ingegeven adres kon niet verwerkt worden. Weet u zeker dat u het goed heeft ingegevoerd?');
        }
        else
        {
            directionsDisplay.setDirections(response);
        }
    });
}


/**
 * Error handles for testRoute. 
 * @param {Object} dir
 */
function errocc(dir){
	code = dir.getStatus().code;
	switch(code){
		case 400:
			alert(Drupal.t('The request could not be parsed. Did you supply an adress?'));
		  break;
		case 500:
		  console.log("G_GEO_SERVER_ERROR - A geocoding, directions or maximum zoom level request could not be successfully processed, yet the exact reason for the failure is not known.");
		  break;
		case 601:
		  console.log("G_GEO_MISSING_QUERY - The HTTP q parameter was either missing or had no value. For geocoding requests, this means that an empty address was specified as input. For directions requests, this means that no query was specified in the input.");
		  break;
		case 602:
			alert(Drupal.t('The supplied address could not be converted to a geographic location, are you sure you typed it correctly?'));
		  break;
		case 603:
			alert(Drupal.t('The geocode for this address cannot be calculated due to legal or contractual reasons.'));
		   break;
		case 604:
			alert(Drupal.t('Could not calculate a route to the destination.'));
		   break;
		case 610:
		  console.log("G_GEO_BAD_KEY - The given key is either invalid or does not match the domain for which it was given. ");
		  break;
		case 620:
		  console.log("G_GEO_TOO_MANY_QUERIES - The given key has gone over the requests limit in the 24 hour period or has submitted too many requests in too short a period of time. If you're sending multiple requests in parallel or in a tight loop, use a timer or pause in your code to make sure you don't send the requests too quickly. ");
		  break;
		default:
			console.log(dir.getStatus().code);
	}
}