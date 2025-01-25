
let map;
let service;
let infowindow;

function initMap() {
  document.addEventListener("DOMContentLoaded", () => {
    const geocoder = new google.maps.Geocoder();

    document.getElementById("get-current-coordinates").addEventListener("click", () => {
      console.log("Getting current coordinates...");
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("Current coordinates:", pos);
        displayResults(pos.lat, pos.lng);
      }, (error) => {
        console.error("Error getting current coordinates:", error);
        alert("Error getting current coordinates: " + error.message);
      });
    });

    document.getElementById("get-coordinates").addEventListener("click", () => {
      console.log("Getting coordinates for address...");
      const country = document.getElementById("country").value.trim();
      const state = document.getElementById("state").value.trim();
      const address = document.getElementById("address").value.trim();
      if (!country || !state || !address) {
        alert("Please enter country, state, and address.");
        return;
      }
      const fullAddress = `${address}, ${state}, ${country}`;
      console.log("Full address:", fullAddress);
      geocodeAddress(geocoder, fullAddress);
    });

    document.getElementById("get-place-rating").addEventListener("click", () => {
      const placeName = document.getElementById("place-name").value.trim();
      if (!placeName) {
        alert("Please enter a place name.");
        return;
      }
      console.log("Getting rating for place:", placeName);
      findPlaceRating(placeName);
    });
  });
}

function geocodeAddress(geocoder, address) {
  console.log("Geocoding address:", address);
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;
      const lat = location.lat();
      const lng = location.lng();
      console.log("Geocoded coordinates:", { lat, lng });
      displayResults(lat, lng);
    } else {
      console.error("Geocode was not successful:", status);
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function findPlaceRating(placeName) {
  console.log("Finding place rating for:", placeName);
  const request = {
    query: placeName,
    fields: ["name", "formatted_address", "rating"],
  };

  service = new google.maps.places.PlacesService(document.createElement('div'));
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        console.log("Place found:", place);
        displayPlaceDetails(place.name, place.formatted_address, place.rating);
      }
    } else {
      console.error("Place search was not successful:", status);
      displayPlaceDetails("No place found", "", "No rating available");
    }
  });
}

function displayResults(lat, lng, rating) {
  console.log("Displaying results:", { lat, lng, rating });
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `
    <h2>Coordinates</h2>
    <p>Latitude: ${lat || ''}</p>
    <p>Longitude: ${lng || ''}</p>
    <p>Rating: ${rating || ''}</p>
  `;
}

function displayPlaceDetails(name, address, rating) {
  console.log("Displaying place details:", { name, address, rating });
  const placeDetailsDiv = document.getElementById("place-details");
  placeDetailsDiv.innerHTML = `
    <h2>Place Details</h2>
    <p>Place Name: ${name}</p>
    <p>Address: ${address}</p>
    <p>Rating: ${rating}</p>
  `;
}