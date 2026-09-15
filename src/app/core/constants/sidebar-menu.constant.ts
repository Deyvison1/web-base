export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}

export const SIDEBAR_MENU: SidebarItem[] = [
  {
    label: 'Início',
    icon: 'home',
    route: '/',
  },
  {
    label: 'Produtos',
    icon: 'add_shopping_cart',
    route: '/product',
  },
  {
    label: 'Categorias',
    icon: 'category',
    route: '/category',
  },
  {
    label: 'Clientes',
    icon: 'person',
    route: '/client',
  },
  {
    label: 'Nota Fiscal',
    icon: 'description',
    route: '/nota-fiscal',
  },
  {
    label: 'Atendimentos',
    icon: 'support_agent',
    route: '/atendimentos',
  },
  {
    label: 'Consumo de Internet',
    icon: 'language',
    route: '/consumo',
  },
];
