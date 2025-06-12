
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Activity, 
  LogOut,
  Home,
  UsersRound,
  MessageCircle,
  BarChart3
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/SupabaseAuthContext";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Arquivos", url: "/admin/files", icon: FileText },
  { title: "Representantes", url: "/admin/representatives", icon: Users },
  { title: "Grupos", url: "/admin/groups", icon: UsersRound },
  { title: "Modelos", url: "/admin/templates", icon: MessageCircle },
  { title: "WhatsApp", url: "/admin/whatsapp", icon: MessageSquare },
  { title: "Logs de Entrega", url: "/admin/logs", icon: Activity },
  { title: "Relatórios", url: "/admin/reports", icon: BarChart3 },
];

export function AdminSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sm">FileShare Pro</h2>
              <p className="text-xs text-gray-500">Painel Admin</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-gray-500 truncate">Administrador</p>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="text-red-600 hover:text-red-700"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
