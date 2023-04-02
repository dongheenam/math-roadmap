import '@/styles/global.css';

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
      <body>{children}</body>
    </html>
  );
}
