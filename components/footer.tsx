import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* روابط قانونية للموقع */}
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>

        {/* حقوق الموقع والاسم ديالك */}
        <div className="text-center md:text-right">
          <p>
            © {new Date().getFullYear()} Toolza. Developed by{" "}
            <a
              href="https://github.com/ibrahimelhaouary"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Ibrahim Elhaouary
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
