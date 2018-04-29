//https://github.com/Qix-/color-convert/
export function hsvToRgb(hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var hi = Math.floor(h) % 6;

	var f = h - Math.floor(h);
	var p = 255 * v * (1 - s);
	var q = 255 * v * (1 - (s * f));
	var t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

export function hsv_to_rgb($iH, $iS, $iV) {

  if($iH < 0)   $iH = 0;   // Hue:
  if($iH > 360) $iH = 360; //   0-360
  if($iS < 0)   $iS = 0;   // Saturation:
  if($iS > 100) $iS = 100; //   0-100
  if($iV < 0)   $iV = 0;   // Lightness:
  if($iV > 100) $iV = 100; //   0-100

  let $dS = $iS/100.0; // Saturation: 0.0-1.0
  let $dV = $iV/100.0; // Lightness:  0.0-1.0
  let $dC = $dV*$dS;   // Chroma:     0.0-1.0
  let $dH = $iH/60.0;  // H-Prime:    0.0-6.0
  let $dT = $dH;       // Temp variable

  while($dT >= 2.0) $dT -= 2.0; // php modulus does not work with float
  let $dX = $dC*(1-Math.abs($dT-1));     // as used in the Wikipedia link

	let $dR, $dG, $dB;

  switch(Math.floor($dH)) {
      case 0:
          $dR = $dC; $dG = $dX; $dB = 0.0; break;
      case 1:
          $dR = $dX; $dG = $dC; $dB = 0.0; break;
      case 2:
          $dR = 0.0; $dG = $dC; $dB = $dX; break;
      case 3:
          $dR = 0.0; $dG = $dX; $dB = $dC; break;
      case 4:
          $dR = $dX; $dG = 0.0; $dB = $dC; break;
      case 5:
          $dR = $dC; $dG = 0.0; $dB = $dX; break;
      default:
          $dR = 0.0; $dG = 0.0; $dB = 0.0; break;
  }

  let $dM  = $dV - $dC;
  $dR += $dM; $dG += $dM; $dB += $dM;
  $dR *= 255; $dG *= 255; $dB *= 255;

  // This would return RGB
  return Math.round($dR)+","+Math.round($dG)+","+Math.round($dB);

  // Instead we'll return html HEX
  //$color = dechex( ($dR << 16) + ($dG << 8) + $dB );
  //return '#' . str_repeat('0', 6 - strlen($color)) . $color;

}
