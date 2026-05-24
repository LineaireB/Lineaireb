function FooterLink({
  href,
  label,
  ariaLabel,
}: Readonly<{
  href: string;
  label: string;
  ariaLabel: string;
}>) {
  return (
    <a
      href={href}
      className="app-footer__link"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      {label}
    </a>
  );
}

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <span className="app-footer__credit">Idée par Corréos · </span>
      <nav className="app-footer__author-links" aria-label="Author links">
        <FooterLink
          href={"https://about.me/chafik.elidrissi"}
          label="Développé par Chafik El Idrissi"
          ariaLabel="Discover Chafik EL IDRISSI profile"
        />
      </nav>
    </footer>
  );
}
