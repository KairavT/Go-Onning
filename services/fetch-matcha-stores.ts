// import * as Location from 'expo-location';
// loc: Location.LocationObject
export default async function fetchMatchaStores() {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    body: JSON.stringify({ textQuery: 'matcha maccha mattya' }),
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': `${process.env.GMAPS_API_KEY}`,
      'X-Goog-FieldMask': 'places.id,places.name'
    }
  });

  const body = await res.json();
  console.log(body);
  return body;
}