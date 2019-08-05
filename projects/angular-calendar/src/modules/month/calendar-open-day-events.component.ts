import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef
} from '@angular/core';
import {
  trigger,
  style,
  state,
  transition,
  animate,
  AnimationTriggerMetadata
} from '@angular/animations';
import { CalendarEvent } from 'calendar-utils';
import { isWithinThreshold, trackByEventId } from '../common/util';
import { CalendarA11y } from '../common/calendar-a11y.provider';

export const collapseAnimation: AnimationTriggerMetadata = trigger('collapse', [
  state(
    'void',
    style({
      height: 0,
      overflow: 'hidden',
      'padding-top': 0,
      'padding-bottom': 0
    })
  ),
  state(
    '*',
    style({
      height: '*',
      overflow: 'hidden',
      'padding-top': '*',
      'padding-bottom': '*'
    })
  ),
  transition('* => void', animate('150ms ease-out')),
  transition('void => *', animate('150ms ease-in'))
]);

@Component({
  selector: 'mwl-calendar-open-day-events',
  template: `
    <ng-template
      #defaultTemplate
      let-events="events"
      let-eventClicked="eventClicked"
      let-isOpen="isOpen"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-open-day-events"
        [@collapse]
        *ngIf="isOpen"
        role="application"
      >
        <span
          tabindex="-1"
          role="alert"
          attr.aria-label="{{ a11y.openDayEventsAlert(date) }}"
        ></span>
        <span
          tabindex="0"
          role="landmark"
          attr.aria-label="{{ a11y.openDayEventsLM(date) }}"
        ></span>
        <div
          *ngFor="let event of events; trackBy: trackByEventId"
          [ngClass]="event?.cssClass"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
        >
          <span
            class="cal-event"
            [ngStyle]="{ backgroundColor: event.color?.primary }"
          >
          </span>
          &ngsp;
          <mwl-calendar-event-title
            [event]="event"
            [customTemplate]="eventTitleTemplate"
            view="month"
            (mwlClick)="eventClicked.emit({ event: event })"
            (mwlKeydown)="eventClicked.emit({ event: event })"
            tabindex="0"
            attr.aria-label="{{ a11y.eventDescription(event) }}"
          >
          </mwl-calendar-event-title>
          &ngsp;
          <mwl-calendar-event-actions
            [event]="event"
            [customTemplate]="eventActionsTemplate"
          >
          </mwl-calendar-event-actions>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        events: events,
        eventClicked: eventClicked,
        isOpen: isOpen,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `,
  animations: [collapseAnimation]
})
export class CalendarOpenDayEventsComponent {
  @Input() isOpen: boolean = false;

  @Input() events: CalendarEvent[];

  @Input() customTemplate: TemplateRef<any>;

  @Input() eventTitleTemplate: TemplateRef<any>;

  @Input() eventActionsTemplate: TemplateRef<any>;

  @Input() date: Date;

  @Output()
  eventClicked: EventEmitter<{ event: CalendarEvent }> = new EventEmitter<{
    event: CalendarEvent;
  }>();

  trackByEventId = trackByEventId;

  validateDrag = isWithinThreshold;

  constructor(public a11y: CalendarA11y) {}
}
