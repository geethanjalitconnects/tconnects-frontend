import { BRAND_NAME, LOGO_MARK, LOGO_SRC } from "../config/brand";
import "./BrandLogo.css";

const { imageWidth, imageHeight, left, top, width, height } = LOGO_MARK;

const markBoxStyle = { aspectRatio: `${width} / ${height}` };
const markImageStyle = {
  width: `${(imageWidth / width) * 100}%`,
  left: `${(-left / width) * 100}%`,
  top: `${(-top / height) * 100}%`,
};

/**
 * The logo mark, cropped to remove the image's white padding, plus the name.
 * variant "plain" blends into light backgrounds; "badge" puts the mark on a
 * white rounded tile for coloured or dark backgrounds.
 */
export default function BrandLogo({ showName = true, variant = "plain", className = "" }) {
  return (
    <span className={`vc-logo vc-logo--${variant} ${className}`.trim()}>
      <span className="vc-logo__mark" style={markBoxStyle}>
        <img
          src={LOGO_SRC}
          alt={showName ? "" : BRAND_NAME}
          width={imageWidth}
          height={imageHeight}
          style={markImageStyle}
          decoding="async"
        />
      </span>
      {showName && <span className="vc-logo__name">{BRAND_NAME}</span>}
    </span>
  );
}

/** Shown on non-home routes while the login check is still running. */
export function BrandLoader() {
  return (
    <div className="vc-loader" role="status" aria-label={`Loading ${BRAND_NAME}`}>
      <BrandLogo className="vc-loader__logo" />
    </div>
  );
}
