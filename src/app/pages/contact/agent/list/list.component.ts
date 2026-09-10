import { Component, QueryList, ViewChildren, effect, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Agent, AgentService, AgentModel, UserService } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';

@UntilDestroy()
@Component({
	selector: 'app-agent-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss'],
	standalone: false
})

export class ListComponent implements OnInit, OnDestroy {
	// bread crumb items
	breadCrumbItems!: Array<{}>;

	agents!: Agent[];
	agent!: Agent;
	dataSource = new MatTableDataSource(this.agentService.allItems());
	displayedColumns = ['code', 'agent', 'contact', 'commission_ratio', 'outstanding', 'action'];
	dataLength: number = 0;
	param: any;
	pageEvent: PageEvent;

	sideView: string = 'view';
	@ViewChild('sideBar') public sideBar;

	constructor(
		public agentService: AgentService,
		public userService: UserService,
		private matDialog: MatDialog,
		private router: Router,
		private formBuilder: UntypedFormBuilder) {
		this.agentService.unSubscribe();
		this.agentService.unSubscribeFilter();
		this.dataInit();
	}

	ngOnInit(): void {
		this.getData();
		this.breadCrumbItems = [
			{ label: 'Application' },
			{ label: 'Enquiry' },
			{ label: 'List', active: true }
		];
	}

	ngOnDestroy(): void {
		this.agentService.unSubscribe();
		this.agentService.unSubscribeFilter();
	}

	dataInit() {
		this.agentService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		effect(() => {
			this.dataSource = new MatTableDataSource(this.agentService.allItems());
			this.agents = this.agentService.allItems();
			this.agent = this.agentService.item();
			this.dataLength = this.agentService.totalItem();
		});
	}

	getData() {
		this.agentService.changeParams({...this.param, with: 'detail'});
		this.agentService.getAllItems();
	}

	viewItem(agent: Agent = new AgentModel({})): void {
	    if (agent && agent.id) {
	        this.router.navigate(['/contact/agent', agent.id]);
	    }
	}

	addForm(agent: Agent = new AgentModel({})): void {
		this.agent = agent;
		this.agentService.changeItem(agent); 
		this.sideView = 'form';
		this.sideBar?.toggle();
	}

	delete(agent: Agent): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'delete',
				title: 'Delete Agent  !!!',
				message: 'Are you sure you want to delete this Agent ?',
				item: agent
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.agentService.destroy(agent.id);
			}
		});
	}

	toggleStatus(isActive: boolean, item: Agent): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'update',
				title: 'Update Agent  Status',
				message: 'Are you sure you want to update the status of this agent?',
				item: item
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				let updateData = { is_active: isActive };
				this.agentService.update(item.id, updateData);
			}
		});
	}

}
