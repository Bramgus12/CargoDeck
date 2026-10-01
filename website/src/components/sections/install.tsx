import { DownloadIcon } from "@/components/download-icon"
import {
  APPLE_CONTAINER_URL,
  APP_NAME,
  RELEASES_URL,
  REQUIREMENTS,
  TROUBLESHOOTING_URL,
} from "@/lib/site"

export function Install() {
  return (
    <section id="install" className="page-width install-section">
      <div className="install-panel">
        <div>
          <img
            src="/icon-192.png"
            alt=""
            width={64}
            height={64}
            loading="lazy"
            className="install-icon"
          />
          <h2 className="t-heading section-heading">Get CargoDeck for Mac.</h2>
          <p className="install-deck">
            Download the signed disk image, open it, and move {APP_NAME} to
            Applications. Install Apple’s{" "}
            <a
              href={APPLE_CONTAINER_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-link"
            >
              container CLI
            </a>{" "}
            first; CargoDeck uses your existing runtime.
          </p>
          <a
            href={RELEASES_URL}
            target="_blank"
            rel="noreferrer"
            className="button-primary"
          >
            <DownloadIcon className="size-[18px]" />
            Download for Mac
          </a>
          <p className="install-help">
            Need a hand?{" "}
            <a
              href={TROUBLESHOOTING_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-link"
            >
              Read the troubleshooting guide
            </a>
            .
          </p>
        </div>
        <aside
          className="requirements-panel"
          aria-labelledby="requirements-heading"
        >
          <h3 id="requirements-heading" className="t-sub">
            Before you download
          </h3>
          <dl className="requirements-list">
            {REQUIREMENTS.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          <p>
            Free and open source. Unofficial, and not affiliated with Apple Inc.
          </p>
        </aside>
      </div>
    </section>
  )
}
