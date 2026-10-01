import "bootstrap/dist/css/bootstrap.min.css";
import { AppUI } from "./ui/AppUI";

document.addEventListener("DOMContentLoaded", () => {
  const app = new AppUI();
  app.init();
});
