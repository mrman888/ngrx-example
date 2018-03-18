import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import { TodoEffects } from './todo.effects';
import { TodoService } from '../core/services/todo.service';
import {
  TodoActionTypes,
  LoadTodos,
  LoadTodosSuccess,
  LoadTodosFail,
  CreateTodo,
  CreateTodoSuccess,
  CreateTodoFail,
  UpdateTodo,
  UpdateTodoSuccess,
  UpdateTodoFail,
  DeleteTodo,
  DeleteTodoSuccess,
  DeleteTodoFail,
} from '../actions';
import { Page, Todo } from '../models';

describe('TodoEffects', () => {
  let actions$: Observable<any>;
  let effects: TodoEffects;
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoEffects,
        provideMockActions(() => actions$),
        {
          provide: TodoService,
          useValue: jasmine.createSpyObj('TodoService', ['findAll', 'find', 'create', 'update', 'delete']),
        }
      ],
    });
    effects = TestBed.get(TodoEffects);
    service = TestBed.get(TodoService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadTodos$', () => {
    it('should return LoadTodosSuccess', () => {
      const page: Page<Todo> = {
        content: [new Todo(1, 'test1'), new Todo(2, 'test2'), new Todo(3, 'test3') ],
        last: false,
        first: true,
        number: 0,
        numberOfElements: 3,
        size: 100,
        sort: null,
        totalElements: 3,
        totalPages: 1
      };
      const action = new LoadTodos();
      const completion = new LoadTodosSuccess({ todos: page.content });

      actions$ = hot('-a', { a: action });
      const response = cold('-b', { b: page });
      const expected = cold('--c', { c: completion });
      service.findAll = () => response;

      expect(effects.loadTodos$).toBeObservable(expected);
    });

    it('should return LoadTodosF', () => {
      const error = 'error';
      const action = new LoadTodos();
      const completion = new LoadTodosFail({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      service.findAll = () => response;

      expect(effects.loadTodos$).toBeObservable(expected);
    });
  });

  describe('createTodo$', () => {
    it('should return CreateTodoSuccess', () => {
      const todo = new Todo(1, 'todo1');
      const action = new CreateTodo({ todo });
      const completion = new CreateTodoSuccess({ todo });

      actions$ = hot('-a', { a: action });
      const response = cold('-b', { b: todo });
      const expected = cold('--c', { c: completion });
      service.create = () => response;

      expect(effects.createTodo$).toBeObservable(expected);
    });

    it('should return CreateTodoFail', () => {
      const error = 'error';
      const action = new CreateTodo({ todo: new Todo(1, 'todo1') });
      const completion = new CreateTodoFail({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      service.create = () => response;

      expect(effects.createTodo$).toBeObservable(expected);
    });
  });

  describe('updateTodo$', () => {
    it('should return UpdateTodoSuccess', () => {
      const todo = new Todo(1, 'todo1');
      const action = new UpdateTodo({ todo: {id: 1, changes: todo } });
      const completion = new UpdateTodoSuccess({ todo: {id: 1, changes: todo } });

      actions$ = hot('-a', { a: action });
      const response = cold('-b', { b: todo });
      const expected = cold('--c', { c: completion });
      service.update = () => response;

      expect(effects.updateTodo$).toBeObservable(expected);
    });

    it('should return UpdateTodoFail', () => {
      const error = 'error';
      const action = new UpdateTodo({ todo: { id: 1, changes: new Todo(1, 'todo1') } });
      const completion = new UpdateTodoFail({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#', { }, error);
      const expected = cold('--c', { c: completion });
      service.update = () => response;

      expect(effects.updateTodo$).toBeObservable(expected);
    });
  });

  describe('deleteTodo$', () => {
    it('should return DeleteTodoSuccess', () => {
      const id = 1;
      const action = new DeleteTodo({ id });
      const completion = new DeleteTodoSuccess({ id });

      actions$ = hot('-a', { a: action });
      const response = cold('-b', { b: id });
      const expected = cold('--c', { c: completion });
      service.delete = () => response;

      expect(effects.deleteTodo$).toBeObservable(expected);
    });

    it('should return DeleteTodoFail', () => {
      const error = 'error';
      const action = new DeleteTodo({ id: 1 });
      const completion = new DeleteTodoFail({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#', { }, error);
      const expected = cold('--c', { c: completion });
      service.delete = () => response;

      expect(effects.deleteTodo$).toBeObservable(expected);
    });
  });

});
