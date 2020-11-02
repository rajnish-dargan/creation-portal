import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyContentComponent } from './my-content.component';
import { ConfigService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
// import { ActionService, RegistryService } from '@sunbird/core';
import { Router } from '@angular/router';

describe('MyContentComponent', () => {
  let component: MyContentComponent;
  let fixture: ComponentFixture<MyContentComponent>;
  let configService;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ MyContentComponent ],
      providers: [ ConfigService, ResourceService, CacheService, BrowserCacheTtlService,
        {
          provide: Router,
          useClass: RouterStub
        } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyContentComponent);
    configService = TestBed.get(ConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
