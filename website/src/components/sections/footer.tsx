import {
  APP_NAME,
  LICENSE_URL,
  REPO_URL,
  TROUBLESHOOTING_URL,
} from "@/lib/site"

const LINKS = [
  { label: "Source on GitHub", href: REPO_URL },
  { label: "Troubleshooting", href: TROUBLESHOOTING_URL },
  { label: "GPL-3.0 license", href: LICENSE_URL },
]

export function Footer() {
  return (
    <footer className="page-width site-footer">
      <div className="footer-brand">
        <a href="/" className="site-brand">
          <img
            src="/favicon.png"
            alt=""
            width={24}
            height={24}
            loading="lazy"
            decoding="async"
            className="size-6 rounded-[6px]"
          />
          <span className="t-sub">{APP_NAME}</span>
        </a>
        <p>A native home for Apple containers.</p>
      </div>
      <nav aria-label="Footer">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
