import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SehajPaathPage } from './sehaj-paath.page';

describe('SehajPaathPage', () => {
  let component: SehajPaathPage;
  let fixture: ComponentFixture<SehajPaathPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SehajPaathPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SehajPaathPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
