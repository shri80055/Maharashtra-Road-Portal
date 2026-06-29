import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-layout-content">
        <Header />

        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}