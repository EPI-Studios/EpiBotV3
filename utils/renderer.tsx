import path from "path";
import { ImageResponse } from "@vercel/og";
import { pathToFileURL } from "url";

export async function renderComponentToPng(
  componentName: string,
  props: { [key: string]: any },
) {
  const componentPath = path.join(
    process.cwd(),
    "components",
    `${componentName}.tsx`,
  );
  let Module = await (await import(pathToFileURL(componentPath).href)).default;
  const image = new ImageResponse(<Module.element {...props} />, {
    width: Module.width,
    height: Module.height,
  });

  const arrayBuffer = await image.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
