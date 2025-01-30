declare module "*.mp3" {
    const content: string;
    export default content;
}

interface Window {
  webkitAudioContext: typeof AudioContext;
}