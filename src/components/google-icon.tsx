import Svg, { Path } from "react-native-svg";

export function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.24 1.4-1.66 4.1-5.4 4.1-3.25 0-5.9-2.7-5.9-6s2.65-6 5.9-6c1.85 0 3.09.79 3.8 1.47l2.6-2.5C16.9 3.6 14.7 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-8.95 0-.6-.06-1.06-.15-1.55H12z"
      />
    </Svg>
  );
}
