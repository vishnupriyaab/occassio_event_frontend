import { Component } from '@angular/core';
import { ReusableTable1Component } from "../../../shared/components/admin/reusable-table1/reusable-table1.component";
import { TableAction, TableColumn } from '../../../models/ITable';

@Component({
  selector: 'app-sound-management',
  imports: [ReusableTable1Component],
  templateUrl: './sound-management.component.html',
  styleUrl: './sound-management.component.css'
})
export class SoundManagementComponent {
  soundColumns: TableColumn[] = [
      { key: 'name', header: 'Name', type: 'text' },
      { key: 'description', header: 'Description', type: 'text' },
      { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
      { key: 'blocked', header: 'Status', type: 'toggle' },
    ];
  
    soundColumnWidths = ['160px', '320px', '190px', '120px'];
  
    sounds = [
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
  
    soundActions: TableAction[] = [
      {
        icon: 'Edit',
        color: 'blue',
        action: (item) => this.editVenue(item),
      },
      {
        icon: 'Delete',
        color: 'red',
        action: (item) => this.deleteVenue(item),
      },
    ];
  
    editVenue(item: any) {
      console.log('Editing venue:', item);
      // Implement edit logic
      // For example, open a modal or navigate to an edit page
    }
  
    deleteVenue(item: any) {
      console.log('Deleting venue:', item);
      // Implement delete logic
      // For example, show a confirmation dialog and remove the item
      this.sounds = this.sounds.filter((sound) => sound !== item);
    }
}
