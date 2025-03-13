import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-modal.component.html',
  styleUrl: './add-modal.component.css',
})
export class AddModalComponent implements OnChanges {
  @Input() heading = '';
  @Input() isOpen = false;
  @Input() initialData: any = null;
  @Input() modalType: 'default' | 'package' = 'default';
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() saveDataEvent = new EventEmitter<any>();

  itemForm!: FormGroup;

  firstRangeLabel = 'Starting Price';
  secondRangeLabel = 'Ending Price';

  constructor(private _fb: FormBuilder) {
    this.itemForm = this._fb.group({
      name: ['', Validators.required],
      description: [''],
      startingPrice: [null, Validators.required],
      endingPrice: [null, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && this.initialData) {
      let startingPrice = null;
      let endingPrice = null;

      if (this.initialData.estimatedCost) {
        const priceMatch = this.initialData.estimatedCost.match(/₹([\d,]+) - ₹([\d,]+)/);
        if (priceMatch) {
          startingPrice = parseInt(priceMatch[1].replace(/,/g, ''));
          endingPrice = parseInt(priceMatch[2].replace(/,/g, ''));
        }
      }

      this.itemForm.patchValue({
        name: this.initialData.name,
        description: this.initialData.description,
        startingPrice: startingPrice,
        endingPrice: endingPrice,
      });
    } else {
      this.itemForm.reset();
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const formData = this.itemForm.value;
      const dataToEmit: any = {
        name: formData.name,
        description: formData.description,
        blocked: this.initialData ? this.initialData.blocked : false,
        id: this.initialData ? this.initialData.id : null,
      };

      if (this.modalType === 'package' || this.heading.includes('Package')) {
        dataToEmit.minGuestCount = formData.startingPrice;
        dataToEmit.maxGuestCount = formData.endingPrice;
        dataToEmit.startingPrice = formData.startingPrice;
        dataToEmit.endingPrice = formData.endingPrice;
      } else {
        dataToEmit.startingPrice = formData.startingPrice;
        dataToEmit.endingPrice = formData.endingPrice;
      }

      this.saveDataEvent.emit(dataToEmit);
      this.closeModal();
    }
  }
}
