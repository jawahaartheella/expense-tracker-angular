import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Injectable } from '@angular/core';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

declare var bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  currentModal: any;

  constructor(private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) { }

  open(title: string, message: string, confirmButtonText?: string, confrimButtonClass?: string, cancelButtonText?: string) {
    // Create Component Dynamically
    const componentRef: ComponentRef<ConfirmDialogComponent> = createComponent(ConfirmDialogComponent, { environmentInjector: this.injector });

    // Set values
    componentRef.instance.title = title;
    componentRef.instance.message = message;  
    if(confirmButtonText?.length) {
      componentRef.instance.confirmButtonText = confirmButtonText;
    }
    if(cancelButtonText?.length) {
      componentRef.instance.cancelButtonText = cancelButtonText;
    }
    if(confrimButtonClass?.length) {
      componentRef.instance.confrimButtonClass = confrimButtonClass;
    }

    // Attach to DOM
    this.appRef.attachView(componentRef.hostView);
    const domElement = (componentRef.hostView as any).rootNodes[0];
    document.body.appendChild(domElement);

    // Show Bootstrap Modal
    this.currentModal = new bootstrap.Modal(domElement.querySelector('#dynamicConfirmModal'));
    this.currentModal.show();

    return componentRef.instance.response.asObservable();
  }
}
