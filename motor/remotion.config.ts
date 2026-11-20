import { Config } from "@remotion/cli/config";

// Sin GPU: WebGL por software (SwiftShader/ANGLE). Necesario para las escenas 3D.
Config.setChromiumOpenGlRenderer("swangle");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setConcurrency(4);
Config.setEntryPoint("src/index.ts");
