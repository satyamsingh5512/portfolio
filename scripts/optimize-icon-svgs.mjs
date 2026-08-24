// Optimizes the path data inside the inline SVG icon components.
//
// These icons are rendered inline ~65 times on the landing page and are also
// serialized a second time into the RSC payload, so their byte size lands in
// the HTML twice. Only the *children* of the root <svg> are rewritten, so any
// props (className, {...props}) on the root element are preserved exactly.
//
// Usage: node scripts/optimize-icon-svgs.mjs [--write]
import { globSync, readFileSync, writeFileSync } from "node:fs";
import { optimize } from "svgo";

const WRITE = process.argv.includes("--write");

// JSX attribute name -> SVG attribute name
const TO_SVG = {
  fillRule: "fill-rule",
  clipRule: "clip-rule",
  clipPath: "clip-path",
  strokeWidth: "stroke-width",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  strokeMiterlimit: "stroke-miterlimit",
  strokeDasharray: "stroke-dasharray",
  strokeOpacity: "stroke-opacity",
  fillOpacity: "fill-opacity",
  stopColor: "stop-color",
  stopOpacity: "stop-opacity",
  gradientUnits: "gradientUnits",
  gradientTransform: "gradientTransform",
  patternUnits: "patternUnits",
  maskUnits: "maskUnits",
  xlinkHref: "xlink:href",
  className: "class",
};
const TO_JSX = Object.fromEntries(
  Object.entries(TO_SVG)
    .filter(([jsx, svg]) => jsx !== svg)
    .map(([jsx, svg]) => [svg, jsx]),
);

const jsxToSvg = (s) =>
  Object.entries(TO_SVG).reduce(
    (acc, [jsx, svg]) => (jsx === svg ? acc : acc.replaceAll(`${jsx}=`, `${svg}=`)),
    s,
  );

const svgToJsx = (s) =>
  Object.entries(TO_JSX).reduce(
    (acc, [svg, jsx]) => acc.replaceAll(`${svg}=`, `${jsx}=`),
    s,
  );

const files = [
  ...globSync("src/components/technologies/*.tsx"),
  ...globSync("src/components/svgs/*.tsx"),
];

let before = 0;
let after = 0;
const skipped = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");

  const open = source.match(/<svg\b[^>]*>/);
  const closeIndex = source.lastIndexOf("</svg>");
  if (!open || closeIndex === -1) {
    skipped.push([file, "no root <svg>"]);
    continue;
  }

  const innerStart = open.index + open[0].length;
  const inner = source.slice(innerStart, closeIndex);

  // Anything with a JS expression in the body is left alone.
  if (inner.includes("{")) {
    skipped.push([file, "contains JSX expression"]);
    continue;
  }

  const viewBox = open[0].match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 128 128";
  const wrapped = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${jsxToSvg(inner)}</svg>`;

  let result;
  try {
    result = optimize(wrapped, {
      multipass: true,
      floatPrecision: 2,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              // Keep structure intact: merging/removing shapes can change how
              // these logos look.
              mergePaths: false,
              removeHiddenElems: false,
              removeUselessStrokeAndFill: false,
              collapseGroups: false,
              convertShapeToPath: false,
              removeViewBox: false,
            },
          },
        },
      ],
    });
  } catch (error) {
    skipped.push([file, `svgo failed: ${error.message}`]);
    continue;
  }

  const optimizedInner = result.data
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "");

  const next =
    source.slice(0, innerStart) +
    "\n      " +
    svgToJsx(optimizedInner) +
    "\n    " +
    source.slice(closeIndex);

  before += source.length;
  after += next.length;

  if (WRITE) writeFileSync(file, next);
  const delta = source.length - next.length;
  if (delta > 200) {
    console.log(
      `${delta > 0 ? "-" : "+"}${Math.abs(delta)}`.padStart(8) +
        `  ${file}  (${source.length} -> ${next.length})`,
    );
  }
}

console.log(
  `\n${WRITE ? "Rewrote" : "Would rewrite"} ${files.length - skipped.length}/${files.length} files: ${before} -> ${after} bytes (${(((before - after) / before) * 100).toFixed(1)}% smaller)`,
);
if (skipped.length) {
  console.log("\nSkipped:");
  for (const [f, why] of skipped) console.log(`  ${f}: ${why}`);
}
