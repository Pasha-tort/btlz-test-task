import config from "config";
import { IConfigApp } from "./config-app.interface.js";

export const ConfigApp = config.get<IConfigApp>("app");
