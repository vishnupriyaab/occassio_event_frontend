import { Component } from '@angular/core';
import { ReusableTable1Component } from "../../../shared/components/admin/reusable-table1/reusable-table1.component";
import { TableAction, TableColumn } from '../../../models/ITable';

@Component({
  selector: 'app-package-management',
  imports: [ReusableTable1Component],
  templateUrl: './package-management.component.html',
  styleUrl: './package-management.component.css'
})
export class PackageManagementComponent {
  packageColumns: TableColumn[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'guestCount', header: 'Guest Count', type: 'text' },
    { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
    { key: 'listed', header: 'Actions', type: 'toggle' }
  ];

  packageColumnWidths = ['160px', '320px', '190px', '120px'];

  packages = [
    { 
      name: 'Normal', 
      guestCount: '50-150', 
      estimatedCost: '₹70,000 - ₹1,35,000',
      listed: true 
    },
    { 
      name: 'Standard', 
      guestCount: '200-300', 
      estimatedCost: '₹20,000 - ₹4,00,000', 
      listed: false 
    },
    // ... other package data
  ];

  packageActions: TableAction[] = [
    { 
      icon: 'Edit', 
      color: 'blue', 
      action: (item) => this.editPackage(item) 
    },
    { 
      icon: 'Delete', 
      color: 'red', 
      action: (item) => this.deletePackage(item) 
    }
  ];

  editPackage(item: any) {
    console.log('Editing package:', item);
    // Implement edit logic
  }

  deletePackage(item: any) {
    console.log('Deleting package:', item);
    // Implement delete logic
  }
}
