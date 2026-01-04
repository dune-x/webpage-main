export type StageFile = {
  id: number;
  name: string;
  file: string; // nombre del KMZ dentro de stages-kmz
  type: "trip" | "stage";
  description?: string;
};

export const stageFiles: StageFile[] = [
  { id: 1, name: "Pre-Uniraid", file: "XX-barcelona-algeciras.kml", type: "trip", description: "Barcelona → Algeciras" },
  { id: 2, name: "Etapa 0", file: "00-algeciras-azrou.kml", type: "trip", description: "Algeciras → Azrou" },
  { id: 3, name: "Etapa 1", file: "01-azrou-errachidia.kml", type: "stage", description: "Azrou → Errachidia" },
  { id: 4, name: "Etapa 2", file: "02-errachidia-erg-chebbi.kml", type: "stage", description: "Errachidia → Erg Chebbi" },
  { id: 5, name: "Etapa 4-5", file: "05-erg-chebbi-nkob.kml", type: "stage", description: "Erg Chebbi → Nkob" },
  { id: 6, name: "Etapa 6", file: "06-nkob-marrakech.kml", type: "stage", description: "Nkob → Marrakech" },
  //{ id: 7, name: "Post-Uniraid", file: "XX-marrakech-barcelona.kml", type: "trip", description: "Marrakech → Barcelona" },
];
