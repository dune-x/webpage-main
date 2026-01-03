export type StageFile = {
  id: number;
  name: string;
  file: string; // nombre del KMZ dentro de stages-kmz
};

export const stageFiles: StageFile[] = [
  { id: 1, name: "El Hajeb → Aufous (Etapa 1)", file: "01-el-hajeb-aufous.geojson" },
  { id: 2, name: "Aufous → Hassi (Etapa 2)", file: "02-aufous-hassi.geojson" },
  { id: 3, name: "Hassi  → Erg Chebbi (Etapa 3)", file: "03-hassi-erg-chebbi.geojson" },
  { id: 4, name: "Erg Chebbi → Nkob (Etapa 4)", file: "04-erg-chebbi-nkob.geojson" },
];
