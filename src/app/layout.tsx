import '@/styles/global.css';
import './layout.css';
import Nav from './Nav';

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
        <div id="root">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
