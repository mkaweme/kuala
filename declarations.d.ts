declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.ttf" {
  const src: import("expo-font").FontSource;
  export default src;
}
