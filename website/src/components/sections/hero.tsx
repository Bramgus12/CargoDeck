import { GithubIcon } from "@/components/github-icon"
import { DownloadIcon } from "@/components/download-icon"
import { DECK, RELEASES_URL, REPO_URL, SCREENSHOT } from "@/lib/site"

const HIGHLIGHTS = [
  {
    title: "A real Mac app",
    body: "A familiar sidebar, native controls, and keyboard shortcuts. Built to belong on your desktop.",
  },
  {
    title: "Your existing runtime",
    body: "CargoDeck uses the container binary already on your Mac. Keep your CLI and your workflow.",
  },
  {
    title: "Nothing hidden",
    body: "See the exact command before it runs. Free, open source, and yours to inspect.",
  },
]

export function Hero() {
  return (
    <section className="hero page-width">
      <div className="hero-intro" data-enter>
        <h1 className="t-display hero-headline">
          Apple containers.
          <br />
          At home on your Mac.
        </h1>
        <p className="hero-deck">{DECK}</p>
        <div className="hero-actions">
          <a
            href={RELEASES_URL}
            target="_blank"
            rel="noreferrer"
            className="button-primary"
          >
            <DownloadIcon className="size-[18px]" />
            Download for Mac
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="button-secondary"
          >
            <GithubIcon className="size-[18px]" />
            View on GitHub
          </a>
        </div>
        <p className="hero-availability">
          Free and open source. For macOS 26+ on Apple silicon.
        </p>
      </div>

      <figure className="hero-product">
        <picture>
          <source
            type="image/avif"
            srcSet={`${SCREENSHOT.base}.avif 1200w, ${SCREENSHOT.base}@2x.avif 2400w`}
            sizes="(min-width: 1200px) 1200px, 100vw"
          />
          <source
            type="image/webp"
            srcSet={`${SCREENSHOT.base}.webp 1200w, ${SCREENSHOT.base}@2x.webp 2400w`}
            sizes="(min-width: 1200px) 1200px, 100vw"
          />
          <img
            src={`${SCREENSHOT.base}.png`}
            srcSet={`${SCREENSHOT.base}.png 1200w, ${SCREENSHOT.base}@2x.png 2400w`}
            sizes="(min-width: 1200px) 1200px, 100vw"
            width={SCREENSHOT.width}
            height={SCREENSHOT.height}
            alt={SCREENSHOT.alt}
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full"
          />
        </picture>
        <figcaption className="product-caption">
          <span>CargoDeck, running on macOS</span>
          <a href="#covers">Explore what it can do</a>
        </figcaption>
      </figure>

      <div className="product-highlights">
        {HIGHLIGHTS.map((item) => (
          <div key={item.title}>
            <h2 className="t-sub">{item.title}</h2>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
