export function SiteFooter() {
  return (
    <footer className="flex sticky bottom-0 z-50 w-full items-center border-t bg-[#071D41]" data-qa="site-footer">
      <div className="flex h-[var(--footer-height)] w-full items-center gap-2 px-4 justify-center">
        <p className="text-sm text-white text-center" data-qa="footer-text">
          O Padrão Digital de Governo utiliza as licenças CC0 1.0 Universal e
          MIT.
        </p>
      </div>
    </footer>
  )
}
