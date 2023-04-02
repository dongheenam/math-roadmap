import '@/styles/global.css';
import './layout.css';

export const metadata = {
  title: 'Mathematics roadmap',
  description: 'Mathematics skilltree for students and teachers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
