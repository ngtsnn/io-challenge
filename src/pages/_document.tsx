import { PORTAL_MODAL_ID } from "@/configs/constants";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <div id={`${PORTAL_MODAL_ID}`} />
      </body>
    </Html>
  );
}
