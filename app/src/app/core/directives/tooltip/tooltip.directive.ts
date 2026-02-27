import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

declare var bootstrap: any;

@Directive({
  selector: '[tooltip]',
  standalone: true
})
export class TooltipDirective implements AfterViewInit {
  @Input('tooltip') tooltipTitle!: string;
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  private tooltipInstance: any;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void{
    this.tooltipInstance = new bootstrap.Tooltip(this.el.nativeElement, {
      title: this.tooltipTitle,
      placement: this.placement,
      trigger: 'hover focus'
    });
  }

  ngOnDestroy(): void {
    this.tooltipInstance?.dispose();
  }
}
