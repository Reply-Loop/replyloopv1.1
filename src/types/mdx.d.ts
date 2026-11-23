declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  import type { JSX } from "react";

  export const frontmatter: {
    title: string;
    /** Under about 60 characters, for the <title> tag. */
    seoTitle: string;
    description: string;
    date: string;
    keyword: string;
  };
  export default function MDXContent(props: MDXProps): JSX.Element;
}
