// Pass-through root layout. Each route group renders its own <html>: the
// localized site in app/(site)/[locale]/layout.tsx, the admin in
// app/(admin)/admin/layout.tsx. This file exists only so app/not-found.tsx
// has a layout to render in — see that file for why it is needed.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
