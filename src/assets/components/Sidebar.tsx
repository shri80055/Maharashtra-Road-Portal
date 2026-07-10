import { useState } from "react";
import {
  LayoutDashboard,
  Route,
  FileText,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  FilePlus,
  FolderOpen,
  FileCheck,
  FileSearch,
  Map,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface SubItem {
  label: string;
  icon: React.ElementType;
  badge?: string;
  path?: string;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  badge?: string;
  subItems?: SubItem[];
  path?: string;
}

const navGroups: { group: string; items: NavItem[] }[] = [
  // {
  //   group: "Main",
  //   items: [
  //     { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  //   ],
  // },
  {
    group: "Road Records",
    items: [
      {
        label: "Survey & Mapping",
        icon: Map,
        subItems: [
          { label: "Register New Road", icon: FilePlus, path: "/register-road" },
          { label: "Praroop-1", icon: FileText, path: "/praroop1" },
          { label: "Praroop-2", icon: FileText, path: "/praroop2" },
          { label: "Praroop-3", icon: FileText, path: "/praroop3" },
        ],
      },
      {
        label: "Road Registration",
        icon: Route,
        subItems: [
          { label: "Draft Records", icon: FolderOpen, badge: "2", path: "/drafts" },
          { label: "Submitted", icon: FileCheck, path: "/submitted" },
          // { label: "Under Review", icon: FileSearch, badge: "5" },
        ],
      },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(["Survey & Mapping", "Road Registration"]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isSubActive = (path?: string) => path && location.pathname === path;


const userInfo = useAuthStore((state) => state.userInfo);

  return (
    <aside
      className={
        "app-sidebar-shell " +
        (collapsed ? "app-sidebar-collapsed" : "app-sidebar-expanded")
      }
    >
      <div className="app-sidebar-logo-row">
        <div className="app-sidebar-logo-icon-wrap">
          <Route size={16} className="app-sidebar-logo-icon" />
        </div>
        {!collapsed && (
          <div className="app-sidebar-logo-text-wrap">
            <p className="app-sidebar-logo-title">Maharashtra</p>
            <p className="app-sidebar-logo-subtitle">Road Portal</p>
          </div>
        )}
      </div>

      <nav className="app-sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.group} className="app-sidebar-group">
            {!collapsed && <p className="app-sidebar-group-label">{group.group}</p>}
            {collapsed && <div className="app-sidebar-group-divider" />}

            {group.items.map((item) => {
              const Icon = item.icon;
              const hasChildren = !!item.subItems?.length;
              const isOpen = openMenus.includes(item.label);
              const isActive = item.path ? location.pathname === item.path : false;

              return (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        if (collapsed) setCollapsed(false);
                        toggleMenu(item.label);
                      } else if (item.path) {
                        navigate(item.path);
                      }
                    }}
                    title={collapsed ? item.label : undefined}
                    className={
                      "app-sidebar-item " +
                      (collapsed ? "app-sidebar-item-collapsed " : "app-sidebar-item-expanded ") +
                      (isActive ? "app-sidebar-item-active" : "app-sidebar-item-idle")
                    }
                  >
                    {isActive && <span className="app-sidebar-item-indicator" />}
                    <Icon
                      size={16}
                      className={"app-sidebar-item-icon " + (isActive ? "app-sidebar-item-icon-active" : "app-sidebar-item-icon-idle")}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && <span className="app-sidebar-item-badge">{item.badge}</span>}
                        {hasChildren && (
                          <ChevronDown
                            size={13}
                            className={"app-sidebar-chevron " + (isOpen ? "rotate-0" : "-rotate-90")}
                          />
                        )}
                      </>
                    )}
                    {collapsed && item.badge && <span className="app-sidebar-collapsed-dot" />}
                  </button>

                  {hasChildren && !collapsed && isOpen && (
                    <div className="app-sidebar-submenu">
                      {item.subItems!.map((sub) => {
                        const SubIcon = sub.icon;
                        const active = isSubActive(sub.path);
                        return (
                          <button
                            key={sub.label}
                            onClick={() => sub.path && navigate(sub.path)}
                            className={
                              "app-sidebar-subitem " +
                              (active ? "app-sidebar-subitem-active" : "app-sidebar-subitem-idle")
                            }
                          >
                            <SubIcon
                              size={13}
                              className={"app-sidebar-subicon " + (active ? "app-sidebar-subicon-active" : "app-sidebar-subicon-idle")}
                            />
                            <span className="flex-1 text-left">{sub.label}</span>
                            {sub.badge && <span className="app-sidebar-subbadge">{sub.badge}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="app-sidebar-profile-wrap">
          <div className="app-sidebar-profile-row">
            <div className="app-sidebar-avatar">
              <span className="app-sidebar-avatar-text">T</span>
            </div>
            <div className="app-sidebar-profile-info">
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
            <ChevronRight size={13} className="app-sidebar-profile-caret" />
          </div>
        </div>
      )}

      <button onClick={() => setCollapsed(!collapsed)} className="app-sidebar-toggle">
        {collapsed ? <PanelLeftOpen size={11} /> : <PanelLeftClose size={11} />}
      </button>
    </aside>
  );
}
