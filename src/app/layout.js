export const metadata = {
  title: "Next.js 14 REST API",
  description: "This is the description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
