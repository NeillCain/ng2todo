import {Control, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from '@angular/common';
import {Component, Output, Input, EventEmitter} from '@angular/core';
import {Todo} from '../common/todo.model';
import {AddTodoComponent} from './addtodo.component'
import {Observable} from 'rxjs/Rx';
import {TodoSearchEvent} from '../common/todoSearchEvent.model'

@Component({
	selector: 'todo-search',
	directives: [FORM_DIRECTIVES, AddTodoComponent],
	template: `
	<form [ngFormModel]="searchForm">
		<div class="row">
			<div class="form-group col-sm-4" [ngClass]="{ 'has-danger' : !skip.valid }">
				<label class="form-control-label" for="skip">Skip</label>
				<input #skipBar [ngFormControl]="skip" placeholder="SKIP" [(ngModel)]="skip1EventFireHack" type="text" class="form-control" [ngClass]="{ 'form-control-danger' : !skip.valid }">
			</div>
			<div class="form-group col-sm-4" [ngClass]="{ 'has-danger' : !take.valid }">
				<label class="form-control-label" for="username">Take</label>
				<input #takeFoo [ngFormControl]="take" placeholder="TAKE" [(ngModel)]="take1EventFireHack" type="text" class="form-control" [ngClass]="{ 'form-control-danger' : !take.valid }">
			</div>
			<div class="form-group col-sm-4" [ngClass]="{ 'has-danger' : !priortyHigherThan.valid }">
				<label class="form-control-label" for="priortyHigherThan">Priority Higher Than</label>
				<input #priortyHigherThanFoo [ngFormControl]="priortyHigherThan" placeholder="Priorty > THAN"
				 	[(ngModel)]="priortyHigherThanEventFireHack" type="text" class="form-control"
					[ngClass]="{ 'form-control-danger' : !priortyHigherThan.valid }">
			</div>
		</div>
	</form>
	<div *ngIf="showDivs" class="row">
		<div class="col-sm-6" style="height: 300px; background-color: red;"
			(mouseover)="onMouseOver($event, takeFoo, skipBar)">Click me</div>
		<div class="col-sm-6" style="height: 300px; background-color: blue;"
			(mousemove)="onMouseMove($event, takeFoo, skipBar)">Click me</div>
	</div>
	`
})
export class TodoSearchComponent {
	private searchForm: ControlGroup;

	private skip: Control = new Control('0', Validators.required);
  private take: Control = new Control('10', Validators.required);
  private priortyHigherThan: Control = new Control('10', Validators.pattern('^([1-9]|[1-9][0-9]|[1][0][0])$'));

	private take1EventFireHack: number = 10;
	private skip1EventFireHack: number = 0;
	private priortyHigherThanEventFireHack: number = 10;

	@Input() showDivs: boolean = false;
  @Output() searchEvent: EventEmitter<TodoSearchEvent> = new EventEmitter<TodoSearchEvent>();

	constructor(private builder: FormBuilder) {
		this.skip.valueChanges.debounceTime(400).startWith(0)
			.combineLatest(this.take.valueChanges.debounceTime(400), this.priortyHigherThan.valueChanges.debounceTime(400)
			.startWith(10), (skip, take, priorityHigherThan) => ({ skip, take, priorityHigherThan }))
			.subscribe(x => {
				console.log('search event fired', x);
				this.searchEvent.emit(x)
			})

		this.searchForm = builder.group({
      skip: this.skip,
      take: this.take,
			priortyHigherThan: this.priortyHigherThan
    });
  }

	onMouseOver(event, take, skip) {
		console.log(event, take, skip);
	}

	onMouseMove(event, take, skip) {
		console.log(event, take, skip);
	}
}