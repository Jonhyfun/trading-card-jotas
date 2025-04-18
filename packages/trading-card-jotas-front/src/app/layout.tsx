import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import { LayoutWrapper } from "./_components/LayoutWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
