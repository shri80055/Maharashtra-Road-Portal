import { Bell, Search, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const userInfo = useAuthStore((state) => state.userInfo);
  return (
    <header className="app-header-bar">
      <div className="app-header-search">
        <Search size={14} className="app-header-search-icon" />
        <input
          type="text"
          placeholder="Search roads, records, districts…"
          className="app-header-search-input"
        />
        <kbd className="app-header-shortcut">
          ⌘
        </kbd>
      </div>

      <div className="app-header-spacer" />

      <div className="app-header-actions">
        <button className="app-header-bell">
          <Bell size={17} />
          <span className="app-header-bell-dot" />
        </button>

        <div className="app-header-divider" />

        <button className="app-header-user">
          <div className="app-header-avatar">
            <span className="app-header-avatar-text">T</span>
          </div>
          <div className="app-header-user-info">
            <p className="app-sidebar-profile-name">
              {userInfo?.sevarthName ?? "Talathi Admin"}
            </p>

            <p className="app-sidebar-profile-meta">
              {userInfo?.sevarth_id}
            </p>

            <p className="app-sidebar-profile-meta">
              {userInfo?.talukaName}, {userInfo?.districtName}
            </p>
          </div>
          <ChevronDown size={13} className="app-header-user-caret" />
        </button>
      </div>
    </header>
  );
}