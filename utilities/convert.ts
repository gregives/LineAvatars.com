type PotraceOptions = {
  turnpolicy?: "black" | "white" | "left" | "right" | "minority" | "majority";
  turdsize?: number;
  optcurve?: boolean;
  alphamax?: number;
  opttolerance?: number;
};

export async function convertImageToPath(url: string, size: number) {
  const { Potrace } = await import("@/utilities/potrace");
  const potrace = Potrace();

  potrace.loadImageFromUrl(url);
  const image = potrace.img;

  const options: PotraceOptions = {
    turdsize: image.width / 10,
    opttolerance: 10000000,
    alphamax: 4 / 3,
  };

  potrace.setParameter(options);

  return new Promise<string | undefined>((resolve) => {
    potrace.process(() => {
      const svg = potrace.getSVG(size / image.width);

      const template = document.createElement("template");
      template.innerHTML = svg;
      const path = template.content.querySelector("path")?.getAttribute("d");

      resolve(path ?? undefined);
    });
  });
}
