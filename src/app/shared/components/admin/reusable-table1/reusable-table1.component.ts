import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableAction, TableColumn } from '../../../../models/ITable';

@Component({
  selector: 'app-reusable-table1',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './reusable-table1.component.html',
  styleUrl: './reusable-table1.component.css'
})
export class ReusableTable1Component {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() columnWidths: string[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onToggleChange(item: any, key: string) {
    item[key] = !item[key];
    // You can add additional logic here, like calling a service
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }

}
