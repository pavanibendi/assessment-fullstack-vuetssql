
export {};

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  type DEPLOYMENT_ENV = "development" | "staging" | "production";
  interface PublicRuntimeConfig {
    DEPLOYMENT_ENV: DEPLOYMENT_ENV;
  }
}