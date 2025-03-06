export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'toggle' | 'actions' | 'serial';
}

export interface TableAction {
  icon: string;
  color: 'green' | 'red' | 'blue';
  action: (item: any) => void;
}
