import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnDestroy {
  private searchSubject = new Subject<string>();

  @Output() searchQuery = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string>();

  @Input() placeholder = 'Search...';

  searchTerm = '';
  selectedFilter = 'all';

  constructor() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(value => {
      this.searchQuery.emit(value);
    });
  }
  onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedFilter = select.value;
    this.filterChange.emit(this.selectedFilter);
  }

  onInputChange(value: string): void {
    this.searchSubject.next(value);
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
