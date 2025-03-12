import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-modal.component.html',
  styleUrl: './add-modal.component.css',
})
export class AddModalComponent {
  @Input() heading: string = '';
  @Input() isOpen: boolean = false;
  @Input() initialData: any = null;
  @Input() modalType: 'default' | 'package' = 'default';
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() saveDataEvent = new EventEmitter<any>();

  itemForm!: FormGroup;

  // Field labels
  firstRangeLabel: string = 'Starting Price';
  secondRangeLabel: string = 'Ending Price';

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
        endingPrice: endingPrice
      });
    } else {
      this.itemForm.reset();
    }
  }

  closeModal() {
    // this.isModalOpen = false;
    this.closeModalEvent.emit();
  }

  // onSubmit() {
  //   if (this.itemForm.valid) {
  //     const formData = this.itemForm.value;

  //     const dataToEmit = {
  //       name: formData.name,
  //       description: formData.description,
  //       startingPrice: formData.startingPrice,
  //       endingPrice: formData.endingPrice,
  //       blocked: this.initialData ? this.initialData.blocked : false,
  //       id: this.initialData ? this.initialData.id : null
  //     };
  //     console.log(dataToEmit,"12")
  //     this.saveDataEvent.emit(dataToEmit);
  //     this.closeModal();
  //   }
  // }

  onSubmit() {
    if (this.itemForm.valid) {
      const formData = this.itemForm.value;
      let dataToEmit: any = {
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
