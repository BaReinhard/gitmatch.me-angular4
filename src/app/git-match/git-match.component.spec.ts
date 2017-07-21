import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitMatchComponent } from './git-match.component';

describe('GitMatchComponent', () => {
  let component: GitMatchComponent;
  let fixture: ComponentFixture<GitMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GitMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
