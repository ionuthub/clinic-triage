const routeModules = import.meta.glob([
  "./*.ts",
  "!./registry.ts",
  "!./loadRoutes.ts",
]);

export async function loadRoutes(): Promise<void> {
  await Promise.all(
    Object.values(routeModules).map(async (load) => await load()),
  );
}
