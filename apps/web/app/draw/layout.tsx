/**
 * Full-bleed under AppBar/Footer without changing other routes:
 * root <main> stays max-w-6xl; this breaks out to viewport width (centered column trick).
 */
export default function DrawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative left-1/2 flex min-h-0 w-screen max-w-[100vw] flex-1 -translate-x-1/2 -mt-8 -mb-20 flex-col overflow-x-hidden overflow-y-auto">
      {children}
    </div>
  );
}
