export {};

declare global {
  interface Window {
    __toggleTheme?: (originX?: number, originY?: number) => void;
    __openCommandPalette?: () => void;
    __closeCommandPalette?: () => void;
  }
}
