import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { Button } from "@/atoms/Button";
import { LinkBtn } from "@/atoms/LinkBtn";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen p-24 ${inter.className}`}
    >
      <div
        className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <div>Just a simple router here! Todo: Implement login methods</div>
      </div>

      <div className="h-6"></div>

      <div className="flex items-center space-x-4">
        <LinkBtn href="/admin">Admin</LinkBtn>
        <LinkBtn href="/consumer">Consumer</LinkBtn>
      </div>
    </main>
  );
}
