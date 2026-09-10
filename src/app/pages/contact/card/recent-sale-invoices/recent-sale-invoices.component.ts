import { Component, OnInit, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-contact-card-recent-sale-invoices',
  templateUrl: './recent-sale-invoices.component.html',
  styleUrls: ['./recent-sale-invoices.component.scss'],
  standalone: false
})
@UntilDestroy()
export class RecentSaleInvoicesComponent implements OnInit {

  @Input() user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void { }

}