import { createServer } from "miragejs";

export function makeServer() {
  createServer({
    routes() {
      this.namespace = "api";

      this.get("/navigation", () => {
        return [
          { name: "Orders", path: "/orders", roles: ["manager", "staff", "driver"] },
          { name: "Delivery", path: "/delivery", roles: ["manager", "driver"] },
          { name: "Menu Management", path: "/menu", roles: ["manager"] },
          { name: "Settings", path: "/settings", roles: ["manager"] },
          { name: "User Management", path: "/users", roles: ["manager"] },
        ];
      });

      this.get("/user", () => {
        return { name: "John Doe", role: "manager" };
      });
    },
  });
}
