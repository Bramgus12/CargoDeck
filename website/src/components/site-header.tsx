import { APP_NAME, APP_VERSION } from "@/lib/site"

const NAV = [
  { label: "Features", href: "#covers" },
  { label: "How it works", href: "#command" },
  { label: "Get CargoDeck", href: "#install" },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="page-width header-inner">
        <a href="/" className="site-brand" aria-label={`${APP_NAME} home`}>
          <img
            src="/favicon.png"
            alt=""
            width={34}
            height={34}
            className="size-[34px] rounded-[8px]"
          />
          <span className="t-sub">{APP_NAME}</span>
        </a>
        <span className="header-version">{APP_VERSION}</span>
        <nav aria-label="Main">
          <ul className="header-links">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
