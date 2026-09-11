export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}

export const SIDEBAR_MENU: SidebarItem[] = [
  {
    label: 'Início',
    icon: 'home',
    route: '/home',
  },
  {
    label: 'Meus Dados',
    icon: 'person',
    route: '/meus-dados',
  },
  {
    label: 'Serviços Contratados',
    icon: 'miscellaneous_services',
    route: '/servicos',
  },
  {
    label: 'Faturas',
    icon: 'receipt_long',
    route: '/faturas',
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
