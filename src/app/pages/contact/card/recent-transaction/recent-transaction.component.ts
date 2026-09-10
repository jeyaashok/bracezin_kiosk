import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-contact-card-recent-transaction',
  templateUrl: './recent-transaction.component.html',
  styleUrls: ['./recent-transaction.component.scss'],
  standalone: false
})
@UntilDestroy()
export class RecentTransactionComponent implements OnInit {

  @Output() onMakePayment = new EventEmitter<any>();
  @Input() user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void { }

  makePayment() {
    this.onMakePayment.emit();
  }
}