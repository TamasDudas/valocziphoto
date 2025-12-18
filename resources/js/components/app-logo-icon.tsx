import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg {...props} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="50"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        V
      </text>
    </svg>
  );
}
