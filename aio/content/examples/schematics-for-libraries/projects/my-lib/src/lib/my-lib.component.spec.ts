import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyLibComponent } from './my-lib.component';

describe('MyLibComponent', () => {
  let component: MyLibComponent;
  let fixture: ComponentFixture<MyLibComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ imports: [MyLibComponent] }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
