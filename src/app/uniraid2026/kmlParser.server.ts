
import { DOMParser } from "@xmldom/xmldom";
import * as togeojson from "@mapbox/togeojson";
import { geojsonToCoords } from "./geojsonParser.server";

export function kmlToCoords(kmlContent: string) {
  const kml = new DOMParser().parseFromString(kmlContent);
  const geojson = togeojson.kml(kml);
  return geojsonToCoords(geojson);
}
