import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSuchVideoComponent } from './no-such-video.component';

describe('NoSuchVideoComponent', () => {
  let component: NoSuchVideoComponent;
  let fixture: ComponentFixture<NoSuchVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoSuchVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoSuchVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
