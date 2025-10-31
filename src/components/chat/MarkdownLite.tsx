"use client";
import Link from "next/link";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownLiteProps {
  text: string;
}

interface MarkdownLinkProps {
  href?: string;
  children?: ReactNode;
}

const MarkdownLink = ({ href, children }: MarkdownLinkProps) => {
  if (!href) return <>{children}</>;

  return (
    <Link
      href={href}
      passHref
      className="underline text-blue-600 hover:text-blue-800 break-all"
    >
      {children}
    </Link>
  );
};

export default function MarkdownLite({ text }: MarkdownLiteProps) {
  return (
    <ReactMarkdown
      components={{
        a: ({ ...props }) => <MarkdownLink {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
