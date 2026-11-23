import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/** Global MDX components. Internal links use next/link; external links open safely. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = "", children, ...rest }) =>
      href.startsWith("/") ? (
        <Link href={href} {...rest}>
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      ),
    ...components,
  };
}
