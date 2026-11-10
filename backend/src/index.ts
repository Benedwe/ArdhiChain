import app from "./app";
import { config } from "./config";
import { log } from "./utils/logger";

app.listen(config.port, () => {
  log.info(`Backend running on http://localhost:${config.port}`);
});
