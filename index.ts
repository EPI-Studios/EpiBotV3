import path from "node:path";
import client from "./client";
import loadDirectoryList from "./utils/loadDirectoryList";
import { pathToFileURL } from "url";
(async () => {
  const modulesPath = path.join(process.cwd(), "modules");
  const modules = await loadDirectoryList(modulesPath, modulesPath);

  for (let key in modules) {
    for (let path of modules[key]!) {
      const { default: cl } = await import(pathToFileURL(path).href);
      try {
        new cl();
      } catch (e) {
        console.error(e);
      }
    }
  }

  await client.login(process.env.TOKEN);
})();
