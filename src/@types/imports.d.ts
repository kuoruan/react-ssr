// stylesheets
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

// SVG icons
declare module "*.svg" {
  import { FC, SVGProps } from "react";

  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

// images
declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}
