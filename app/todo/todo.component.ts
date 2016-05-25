import {Component, OnInit, Output, Input, EventEmitter, ViewChild} from '@angular/core';
import {Control, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {TodoService} from '../common/todo.service';
import {Todo} from '../common/todo.model'
import {AddTodoComponent} from './addtodo.component'
import {TodoSearchComponent } from './todoSearch.component'
import {Observable, Observer} from 'rxjs/Rx';
import * as sio from 'socket.io-client';

@Component({
  selector: 'todo',
  template: `
  <div class="page-header m-t-1">
    <h1>{{title}}</h1>
  </div>
  <hr>
  <todo-search [todos]="todos"></todo-search>
  <addtodo></addtodo>
  <div class="error" *ngIf="errorMessage">{{errorMessage}}</div>`,
  providers: [TodoService],
  directives: [AddTodoComponent, TodoSearchComponent, FORM_DIRECTIVES]
})

export class TodoComponent implements OnInit {
  @ViewChild(TodoSearchComponent) todoSearchComponent: TodoSearchComponent;
  private title: string;
  private errorMessage: string;
  private todos: Todo[] = [];
  private socket: SocketIOClient.Socket;

  constructor(private todoService: TodoService) {
  }

  ngOnInit() {
    this.title = 'Todo List'
    this.socket = sio.connect('ws://todo.kungfoobar.me');
    this.socket.on('post', data => console.log(data))
    this.socket.on('put', data => console.log(data))
  }

  ngAfterViewInit() {
    this.todoSearchComponent.searchEvent
      .flatMap(searchEvent => this.todoService.getTodos(searchEvent.skip, searchEvent.take))
      .subscribe(result => {
        console.log('result', result);
        this.todos = result;
      }
      , error => this.errorMessage = error);
  }
}
