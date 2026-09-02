import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WeGame Agent Demo',
  description: '理解玩家状态的全旅程 AI 游戏助手概念 Demo',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark">
      <body>{children}</body>
    </html>
  );
}
