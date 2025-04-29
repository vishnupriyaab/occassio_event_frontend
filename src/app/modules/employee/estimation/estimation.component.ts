import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NoteService } from '../../../core/services/employee/noteService/note.service';
import { response } from 'express';
import IToastOption from '../../../core/models/IToastOptions';
import { ToastService } from '../../../core/services/common/toaster/toast.service';

@Component({
  selector: 'app-estimation',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './estimation.component.html',
  styleUrl: './estimation.component.css',
})
export class EstimationComponent {
  step = 1;
  totalSteps = 2;

  estimationForm!: FormGroup;
  noteContent: string = ''; ////////////////////////////////////////////
  userId: string = '';

  grandTotal = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _noteService: NoteService,
    private _toastService: ToastService
  ) {}

  ngOnInit() {
    this.initForm();
    this.setupValueChanges();
    this.route.params.subscribe(params => {
      this.userId = params['clientId'];
      console.log(this.userId,"123456789")
      if(this.userId){
        this.loadNote();
      }
    });
  }

  initForm(): void {
    this.estimationForm = this.fb.group({
      venue: this.fb.group({
        details: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(0)]],
        cost: [0, [Validators.required, Validators.min(0)]],
        total: [0],
      }),
      seating: this.fb.group({
        details: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(0)]],
        cost: [0, [Validators.required, Validators.min(0)]],
        total: [0],
      }),
      welcomeDrink: this.fb.group({
        details: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(0)]],
        cost: [0, [Validators.required, Validators.min(0)]],
        total: [0],
      }),
      mainCourse: this.fb.group({
        details: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(0)]],
        cost: [0, [Validators.required, Validators.min(0)]],
        total: [0],
      }),
      dessert: this.fb.group({
        details: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(0)]],
        cost: [0, [Validators.required, Validators.min(0)]],
        total: [0],
      }),
      decoration: this.fb.group({
        details: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(0)]],
        cost: [0, [Validators.required, Validators.min(0)]],
        total: [0],
      }),
      soundSystem: this.fb.group({
        details: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(0)]],
        cost: [0, [Validators.required, Validators.min(0)]],
        total: [0],
      }),
      photography: this.fb.group({
        details: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(0)]],
        cost: [0, [Validators.required, Validators.min(0)]],
        total: [0],
      }),
    });
  }

  setupValueChanges(): void {
    const itemNames = ['venue', 'seating', 'welcomeDrink', 'mainCourse', 'dessert', 'decoration', 'soundSystem', 'photography'];

    itemNames.forEach(itemName => {
      const itemGroup = this.estimationForm.get(itemName) as FormGroup;

      itemGroup.get('quantity')!.valueChanges.subscribe(() => {
        this.calculateItemTotal(itemName);
      });

      itemGroup.get('cost')!.valueChanges.subscribe(() => {
        this.calculateItemTotal(itemName);
      });
    });
  }

  calculateItemTotal(itemName: string): void {
    const itemGroup = this.estimationForm.get(itemName) as FormGroup;
    const quantity = itemGroup.get('quantity')!.value || 0;
    const cost = itemGroup.get('cost')!.value || 0;
    const total = quantity * cost;

    itemGroup.get('total')!.setValue(total, { emitEvent: false });

    this.calculateGrandTotal();
  }

  calculateGrandTotal(): void {
    const itemNames = ['venue', 'seating', 'welcomeDrink', 'mainCourse', 'dessert', 'decoration', 'soundSystem', 'photography'];

    this.grandTotal = itemNames.reduce((total, itemName) => {
      const itemTotal = this.estimationForm.get(`${itemName}.total`)!.value || 0;
      return total + itemTotal;
    }, 0);
  }

  nextStep(): void {
    if (this.step < this.totalSteps) {
      if (this.step === 1) {
        const step1Items = ['venue', 'seating', 'welcomeDrink', 'mainCourse', 'dessert', 'decoration'];
        const isStep1Valid = step1Items.every(item => this.estimationForm.get(item)!.valid);

        if (!isStep1Valid) {
          this.markFormGroupsTouched(step1Items);
          return;
        }
      }

      this.step++;
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  saveEstimation(): void {
    const step2Items = ['soundSystem', 'photography'];
    const isStep2Valid = step2Items.every(item => this.estimationForm.get(item)!.valid);

    if (!isStep2Valid) {
      this.markFormGroupsTouched(step2Items);
      return;
    }

    console.log('Saving estimation:', this.estimationForm.value);

    alert('Estimation saved successfully! Total: ' + this.grandTotal);
  }

  cancelEstimation(): void {
    this.estimationForm.reset({
      venue: { details: '', quantity: 0, cost: 0, total: 0 },
      seating: { details: '', quantity: 0, cost: 0, total: 0 },
      welcomeDrink: { details: '', quantity: 0, cost: 0, total: 0 },
      mainCourse: { details: '', quantity: 0, cost: 0, total: 0 },
      dessert: { details: '', quantity: 0, cost: 0, total: 0 },
      decoration: { details: '', quantity: 0, cost: 0, total: 0 },
      soundSystem: { details: '', quantity: 0, cost: 0, total: 0 },
      photography: { details: '', quantity: 0, cost: 0, total: 0 },
    });

    this.grandTotal = 0;
    this.step = 1;
  }

  markFormGroupsTouched(itemNames: string[]): void {
    itemNames.forEach(itemName => {
      const controls = (this.estimationForm.get(itemName) as FormGroup).controls;

      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched();
      });
    });
  }

  isInvalid(itemName: string, controlName: string): boolean {
    const control = this.estimationForm.get(`${itemName}.${controlName}`);
    return control!.invalid && control!.touched;
  }

  loadNote(): void {
    console.log(this.userId,"userIddddd")
    this._noteService.getNotes(this.userId).subscribe({
      next: response => {
        console.log(response, 'response');
        this.noteContent = response.data.content;
      },
      error: error => {
        console.log(error, 'error');
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to fetch Note',
        };
        this._toastService.showToast(toastOption);
        return;
      },
    });
  }
}
