// expo-image, expo-linear-gradient, and expo-blur don't ship NativeWind
// support out of the box, so `className` is registered manually here to map
// onto `style`. Import this once, before any screen renders.
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

cssInterop(Image, { className: "style" });
cssInterop(LinearGradient, { className: "style" });
cssInterop(BlurView, { className: "style" });
