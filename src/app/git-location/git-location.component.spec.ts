import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitLocationComponent } from './git-location.component';

describe('GitLocationComponent', () => {
  let component: GitLocationComponent;
  let fixture: ComponentFixture<GitLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GitLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
