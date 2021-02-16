 var control;
function descargaArchivo() {
	// Obtener la instancia del objeto XMLHttpRequest
	var peticion_http = new XMLHttpRequest();

	// Preparar la funcion de respuesta
	peticion_http.onreadystatechange = muestraContenido;
	// let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=16e55f76b779cb95beac85c228210b95&lang=es&units=metric`;

	// Realizar peticion HTTP
	peticion_http.open('GET', './message.json', true);
	peticion_http.send();

	function muestraContenido() {
		if (peticion_http.readyState == 4) {
			if (peticion_http.status == 200) {
				let message = JSON.parse(peticion_http.responseText);
				console.log(message);
				
				for (let i = 0; i < message.ubicacion.length; i++) {
					geocoder
						.geocode()
						.address(message.ubicacion[i].street_address)
						.city(message.ubicacion[i].city)
						.region(message.ubicacion[i].state)
						.run(function (error, response) {
							//geocoder.geocode().text("diagonal 455 barcelona").run(function (error, response) {
							if (error) {
								return;
							}
							console.log(response);
							map.fitBounds(response.results[0].bounds);
							map.setZoom(18);
							
							var yellowIcon = new L.Icon({
								iconUrl:
									'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
								shadowUrl:
									'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
								iconSize: [25, 41],
								iconAnchor: [12, 41],
								popupAnchor: [1, -34],
								shadowSize: [41, 41],
							});

							var pointsFriends = L.marker(response.results[0].latlng, {
								icon: yellowIcon,
							});

							pointsFriends
								.addTo(map)
								.bindPopup(
									`<b>${message.ubicacion[i].street_address}</b> 
								<b>${message.ubicacion[i].city}</b>`
								)
								.openPopup();
							// mi ubicacion
							function getLocation() {
								if (navigator.geolocation) {
									navigator.geolocation.getCurrentPosition(
										showPosition,
										function (error) {
											alert('error! :(');
											console.log(error);
										}
									);
								}
							}

							function showPosition(position) {
								L.marker([position.coords.latitude, position.coords.longitude])
									.addTo(map)
									.bindPopup('mi ubicacion')
									.openPopup();

								map.flyTo([position.coords.latitude, position.coords.longitude], 12);

								function onMapClick() {
									console.log('click');
									// L.marker()
									// 	.addTo(map)
									// 	.bindPopup('ubicación amigo')
									// 	.openPopup();
									// popup.setLatLng(e.latlng);								
									
									console.log(control);
									if(control){										
										map.removeControl(control);
									}

									control = L.Routing.control({
										
										waypoints: [
											response.results[0].latlng,
											[position.coords.latitude, position.coords.longitude],
										],
										lineOptions: {
											styles: [{color: 'green', opacity: 1, weight: 6}]
										 },
										 fitSelectedRoutes: true,
										 altLineOptions: {
											styles: [
												{color: 'red', opacity: 0.15, weight: 9},
												{color: 'white', opacity: 0.8, weight: 6},
												{color: 'blue', opacity: 1, weight: 5}
											]
										},
										showAlternatives: true,
										routeWhileDragging: true,
										language: 'es'
										
									})									
									.addTo(map);								

								}

								pointsFriends.addEventListener('click', onMapClick);

								// cremos un popup
								// var popup = L.popup();
								// funcion que queremos ejecutar cuando cliquemos en el mapa

								//  map.on('click', onMapClick);
							}
							//-----fin ubicacion y ruta
							getLocation();
						});
				}

				// document.getElementById('weather').value= weather.weather[0].description;
				// document.getElementById('temp').value= weather.main.temp;
				// popup
				// .setContent(weather.weather[0].description + " " + weather.main.temp )
				// .openOn(mymap);
			}
		}
	}
}
// aqui relacionamos el evento click con la funcion que acabamos de crear
