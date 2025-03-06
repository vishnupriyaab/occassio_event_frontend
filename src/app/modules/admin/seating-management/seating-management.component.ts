import { Component } from '@angular/core';
import { TableAction, TableColumn } from '../../../models/ITable';
import { ReusableTable1Component } from '../../../shared/components/admin/reusable-table1/reusable-table1.component';
import { AddModalComponent } from "../../../shared/components/admin/add-edit-modal/add-modal.component";

@Component({
  selector: 'app-seating-management',
  imports: [ReusableTable1Component, AddModalComponent],
  templateUrl: './seating-management.component.html',
  styleUrl: './seating-management.component.css',
})
export class SeatingManagementComponent {
  isModalOpen = false;
  modalHeading = '';
  seatingColumns: TableColumn[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'description', header: 'Description', type: 'text' },
    { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
    { key: 'blocked', header: 'Status', type: 'toggle' },
  ];

  seatingColumnWidths = ['160px', '320px', '190px', '120px'];

  seatings = [
    {
      name: 'Community Hall',
      description: 'Budget-friendl',
      estimatedCost: '₹10,000 - ₹30,000',
      blocked: false,
    },
    {
      name: 'Resort dcfghj fghj fcgvbhj cfvgbhnj',
      description:
        'Experience luxury and comfort swdefrgthyuj edfrtgyhuji dfrgtyhuji',
      estimatedCost: '₹50,000 - ₹2,00,000',
      blocked: true,
    },
    {
      name: '5-star banquet',
      description: 'Offering premium ',
      estimatedCost: '₹2,00,000 - ₹10,00,000',
      blocked: true,
    },
    {
      name: 'Open ground',
      description: 'Offering a szxdcfvgbhnj defrgthyjuk sxdcfvgbhj dxcfvgbhnjm',
      estimatedCost: '₹2,00,000 - ₹10,00,000',
      blocked: false,
    },
  ];

  seatingActions: TableAction[] = [
    {
      icon: 'Edit',
      color: 'blue',
      action: (item) => this.editSeating(item),
    },
    {
      icon: 'Delete',
      color: 'red',
      action: (item) => this.deleteSeating(item),
    },
  ];

  addSeating() {
    this.modalHeading = 'Add Seating';
    this.isModalOpen = true;
  }

  editSeating(item: any) {
    console.log('Editing venue:', item);
    // Implement edit logic
    // For example, open a modal or navigate to an edit page
  }

  deleteSeating(item: any) {
    console.log('Deleting venue:', item);
    // Implement delete logic
    // For example, show a confirmation dialog and remove the item
    this.seatings = this.seatings.filter((seating) => seating !== item);
  }
}
