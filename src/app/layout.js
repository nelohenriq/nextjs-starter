
export const metadata = {
  title: "Lama Dev",
  description: "This is the description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
            <div className="container">
              {children}
            </div>
      </body>
    </html>
  );
}
