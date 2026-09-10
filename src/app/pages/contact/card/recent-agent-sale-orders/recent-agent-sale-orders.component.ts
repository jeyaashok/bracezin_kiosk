import { Component, OnInit, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-contact-card-recent-agent-sale-orders',
  templateUrl: './recent-agent-sale-orders.component.html',
  styleUrls: ['./recent-agent-sale-orders.component.scss'],
  standalone: false
})
@UntilDestroy()
export class RecentAgentSaleOrdersComponent implements OnInit {

  @Input() user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void { }

}