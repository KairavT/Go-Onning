import { LocationRegion } from "expo-location";

export default function coordsToLocReg(coords: any[] | null) {
  const locRegs = [];
  if (coords) {
    console.log('fduhdufdhufs', coords);
    for (let coord of coords) {
      let locReg: LocationRegion = {
        latitude: coord.lat,
        longitude: coord.lng,
        radius: 50,
        notifyOnEnter: true,
        notifyOnExit: true,
      };
      locRegs.push(locReg);
    }
    return locRegs;
  }
}