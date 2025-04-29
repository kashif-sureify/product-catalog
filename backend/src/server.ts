import app from ".";
import { productDB } from "./config/productDB";
import { userDB } from "./config/userDB";

const PORT = process.env.PORT || 3000;

export const startServer = async () => {
  await productDB();
  await userDB();
  app.listen(PORT);
};

if (require.main === module) {
  startServer();
}
