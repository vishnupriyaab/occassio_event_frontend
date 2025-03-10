import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableAction, TableColumn } from '../../../../core/models/ITable';

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
  @Output() toggleChange = new EventEmitter<{item: any, value: boolean}>();

  onToggleChange(item: any) {
    item.blocked = !item.blocked; 
    this.toggleChange.emit({ item, value: !item.blocked });
  }

  onEdit(item: any) {
    console.log("11")
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  } 

}
